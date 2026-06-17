'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './task-card';
import { Column } from './column';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { CreateTaskModal } from './create-task-modal';

const columns = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'REVIEW', title: 'Review', color: 'bg-amber-500' },
  { id: 'DONE', title: 'Done', color: 'bg-emerald-500' },
];

type NewTaskTitle = {
  id: string;
  text: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
};

interface KanbanBoardProps {
  boardId: string;
}

// export function KanbanBoard({ workspaceId }: { workspaceId: string }) {
export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newTaskTitles, setNewTaskTitles] = useState<NewTaskTitle[]>([
    { id: 'new-task-TODO', text: '' },
    { id: 'new-task-IN_PROGRESS', text: '' },
    { id: 'new-task-REVIEW', text: '' },
    { id: 'new-task-DONE', text: '' },
  ]);
  const [loading, setLoading] = useState(true);

  const setNewTaskTitle = (id: string, text: string) => {
    const updatedTaskTitles = newTaskTitles.map((newTaskTitle) => {
      // Only update the specific item being typed into
      if (newTaskTitle.id === id) {
        return { ...newTaskTitle, text: text };
      }
      return newTaskTitle;
    });
    setNewTaskTitles(updatedTaskTitles);
  };

  const getNewTaskTitle = (id: string) => {
    return newTaskTitles.find((x) => x.id === id);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?boardId=${boardId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const createTask = async (status: Task['status'] = 'TODO') => {
    const newTaskTitleId = `new-task-${status}`;
    const newTaskTitle = getNewTaskTitle(newTaskTitleId)?.text;
    if (!newTaskTitle || !newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          status,
          priority: 'MEDIUM',
          boardId: boardId,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
        setNewTaskTitle(newTaskTitleId, '');
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // TODO: Persist to backend
    toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
  };

  //   useEffect(() => {
  //     fetchTasks();
  //   }, [workspaceId]);

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(e) =>
        setActiveTask(tasks.find((t) => t.id === e.active.id) || null)
      }
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex justify-end mb-6">
        <CreateTaskModal boardId={boardId} onTaskCreated={handleTaskCreated} />
      </div>

      <div className="flex gap-6 h-full overflow-x-auto pb-8">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnTasks.length}
              color={column.color}
            >
              {/* Quick Add Task */}
              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="New task..."
                  value={getNewTaskTitle(`new-task-${column.id}`)?.text}
                  id={`new-task-${column.id}`}
                  onChange={(e) =>
                    setNewTaskTitle(`new-task-${column.id}`, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      createTask(column.id as Task['status']);
                  }}
                />
                <Button
                  size="icon"
                  onClick={() => createTask(column.id as Task['status'])}
                >
                  <Plus size={18} />
                </Button>
              </div>

              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
