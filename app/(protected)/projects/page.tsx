'use client';

import { useState, useEffect } from 'react';
import { FolderKanban } from 'lucide-react';
import { CreateProjectModal } from '@/components/projects/create-project-modal';

type Project = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  workspace: {
    name: string;
  };
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
              Manage all your projects
            </p>
          </div>
          <CreateProjectModal onProjectCreated={fetchProjects} />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading projects...</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border rounded-2xl p-6 hover:border-violet-500 transition-all hover:shadow-md cursor-pointer"
              >
                <h3 className="font-semibold text-xl mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                    {project.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  {project.workspace.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
