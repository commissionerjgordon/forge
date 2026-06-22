'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { CreateWorkspaceModal } from '@/components/workspaces/create-workspace-modal';

type WorkspaceWithMembers = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  members: Array<{
    role: string;
    user: {
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
};

export default function WorkspacesPage() {
  const { currentWorkspace, setCurrentWorkspace, refreshWorkspaces } =
    useWorkspace();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithMembers[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleSwitchWorkspace = (workspace: any) => {
    setCurrentWorkspace(workspace);
    toast.success(`Switched to ${workspace.name}`);
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground mt-2">
              Manage your teams and workspaces
            </p>
          </div>
          <CreateWorkspaceModal onWorkspaceCreated={fetchWorkspaces} />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading workspaces...</div>
        ) : workspaces.length === 0 ? (
          <Card className="p-16 text-center">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-medium">No workspaces yet</h3>
            <p className="text-muted-foreground mt-3 mb-8">
              Create your first workspace to get started
            </p>
            <CreateWorkspaceModal onWorkspaceCreated={fetchWorkspaces} />
          </Card>
        ) : (
          <div className="grid gap-6">
            {workspaces.map((workspace) => {
              console.log(workspace);
              const isCurrent = currentWorkspace?.id === workspace.id;
              const memberCount = workspace.members.length;

              return (
                <Card
                  key={workspace.id}
                  className={`p-8 transition-all ${isCurrent ? 'border-violet-500 ring-1 ring-violet-500' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-linear-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                        {workspace.name[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-semibold">
                            {workspace.name}
                          </h2>
                          {isCurrent && <Badge>Current</Badge>}
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {workspace.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Users size={16} />
                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!isCurrent && (
                        <Button
                          variant="outline"
                          onClick={() => handleSwitchWorkspace(workspace)}
                        >
                          Switch to Workspace
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Settings size={20} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
