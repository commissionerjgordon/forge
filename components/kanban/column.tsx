'use client';

import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

export function Column({ id, title, count, color, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Badge variant="secondary">{count}</Badge>
      </div>

      <Card
        ref={setNodeRef}
        className={`p-4 min-h-150 bg-muted/30 border-2 transition-colors flex flex-col ${
          isOver ? 'border-violet-500 bg-violet-500/10' : 'border-transparent'
        }`}
      >
        <div className="flex-1 space-y-3">{children}</div>
      </Card>
    </div>
  );
}
