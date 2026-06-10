import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  workspaceId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, workspaceId } = createProjectSchema.parse(body);

    // Verify user has access to this workspace
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: (await prisma.user.findUnique({
            where: { clerkId: userId },
          }))!.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
      include: {
        workspace: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const projects = await prisma.project.findMany({
    where: {
      workspace: {
        members: {
          some: { userId: user.id },
        },
      },
    },
    include: {
      workspace: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(projects);
}
