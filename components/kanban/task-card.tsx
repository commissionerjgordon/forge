'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
};

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    LOW: 'bg-slate-500',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${isDragging ? 'scale-105' : ''}`}
      {...attributes}
    >
      <div className="flex gap-3">
        {/* Drag Handle */}
        <div
          {...listeners}
          className="text-muted-foreground hover:text-foreground mt-0.5 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium leading-tight">{task.title}</h4>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <Badge
              variant="secondary"
              className={`text-xs ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
