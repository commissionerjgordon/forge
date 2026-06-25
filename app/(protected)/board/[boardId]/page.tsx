'use client';

import { useParams } from 'next/navigation';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Board = {
  id: string;
  name: string;
  description?: string;
};

export default function BoardPage() {
  const { boardId } = useParams();
  const { currentWorkspace } = useWorkspace();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`/api/boards/${boardId}`);
        if (res.ok) {
          const data = await res.json();
          setBoard(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  useEffect(() => {
    router.push('/board');
  }, [currentWorkspace?.id]);

  if (loading) return <div className="p-8">Loading board...</div>;
  if (!board) return <div className="p-8">Board not found</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-8">
        <h1 className="text-3xl font-bold">{board.name}</h1>
        {board.description && (
          <p className="text-muted-foreground mt-1">{board.description}</p>
        )}
      </div>

      <div className="flex-1 p-8 overflow-hidden">
        <KanbanBoard boardId={boardId as string} />
      </div>
    </div>
  );
}
