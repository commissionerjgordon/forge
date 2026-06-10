import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const eventType = evt.type;

  // Handle user creation / update
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    try {
      // Create User
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          email: primaryEmail,
          image: image_url,
        },
        create: {
          clerkId: id,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          email: primaryEmail!,
          image: image_url,
        },
      });

      // Auto-create first Workspace for new user
      const workspaceName = user.name
        ? `${user.name}'s Workspace`
        : 'My Workspace';

      const workspace = await prisma.workspace.create({
        data: {
          name: workspaceName,
          slug: `personal-${Date.now()}`,
          description: 'Personal workspace',
        },
      });

      // Add user as ADMIN
      await prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: 'ADMIN',
        },
      });

      console.log(`✅ New user + workspace created: ${primaryEmail}`);
    } catch (error) {
      console.error('Error creating user/workspace:', error);
    }
  } else if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses[0]?.email_address;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        email: primaryEmail,
        image: image_url,
      },
      create: {
        clerkId: id,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        email: primaryEmail!,
        image: image_url,
      },
    });
  }

  return new Response('Webhook processed', { status: 200 });
}
