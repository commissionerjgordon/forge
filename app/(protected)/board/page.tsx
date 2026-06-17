'use client';

import { useWorkspace } from '@/components/providers/workspace-provider';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { CreateTaskModal } from '@/components/kanban/create-task-modal';
import { Button } from '@/components/ui/button';

export default function BoardPage() {
  const { currentWorkspace } = useWorkspace();

  if (!currentWorkspace) {
    return (
      <div className="p-8 text-center">Please select a workspace first.</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Board</h1>
          <p className="text-muted-foreground">{currentWorkspace.name}</p>
        </div>
        {/* <CreateTaskModal
          onTaskCreated={(newTask) => window.location.reload()}
        />{' '} */}
        {/* We'll improve this later */}
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        {/* <KanbanBoard workspaceId={currentWorkspace.id} /> */}
      </div>
    </div>
  );
}
