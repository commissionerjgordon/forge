import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, projectId } = body;

    if (!name || !projectId) {
      return NextResponse.json(
        { error: 'Name and projectId are required' },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name,
        description,
        projectId,
      },
      include: {
        project: {
          select: { name: true, workspaceId: true },
        },
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}

// GET /api/boards?projectId=xxx   → List boards in a project
// GET /api/boards?boardId=xxx     → Get single board (for the board page)
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = req.nextUrl.searchParams.get('projectId');
  const boardId = req.nextUrl.searchParams.get('boardId');

  try {
    if (boardId) {
      // Fetch single board
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
          project: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!board) {
        return NextResponse.json({ error: 'Board not found' }, { status: 404 });
      }

      return NextResponse.json(board);
    }

    if (projectId) {
      // List all boards in a project
      const boards = await prisma.board.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(boards);
    }

    return NextResponse.json(
      { error: 'projectId or boardId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}
