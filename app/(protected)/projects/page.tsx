'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, Kanban } from 'lucide-react';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { CreateBoardModal } from '@/components/boards/create-board-modal';

type Project = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  boards: Array<{
    id: string;
    name: string;
  }>;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your projects and boards
            </p>
          </div>
          <CreateProjectModal onProjectCreated={fetchProjects} />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed rounded-3xl p-20 text-center">
            <FolderKanban className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-medium">No projects yet</h3>
            <p className="text-muted-foreground mt-3 mb-8">
              Create your first project to get started
            </p>
            <CreateProjectModal onProjectCreated={fetchProjects} />
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{project.name}</h2>
                    {project.description && (
                      <p className="text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <CreateBoardModal
                    projectId={project.id}
                    onBoardCreated={fetchProjects}
                  />
                </div>

                {/* Boards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.boards && project.boards.length > 0 ? (
                    project.boards.map((board) => (
                      <a
                        key={board.id}
                        href={`/board/${board.id}`}
                        className="block border rounded-2xl p-6 hover:border-violet-500 hover:shadow-md transition-all group"
                      >
                        <Kanban className="h-8 w-8 text-violet-500 mb-4" />
                        <h3 className="font-medium text-lg group-hover:text-violet-600">
                          {board.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Kanban Board
                        </p>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                      No boards yet. Create your first board above.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
