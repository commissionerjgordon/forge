import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(workspaces);
}
