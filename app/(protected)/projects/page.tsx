import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { FolderKanban, Plus } from 'lucide-react';
import { CreateProjectModal } from '@/components/projects/create-project-modal';

export default async function ProjectsPage() {
  const user = await currentUser();

  const projects = await prisma.project.findMany({
    where: {
      workspace: {
        members: {
          some: {
            user: { clerkId: user?.id },
          },
        },
      },
    },
    include: {
      workspace: true,
    },
    orderBy: { createdAt: 'desc' },
  });

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

          <CreateProjectModal />
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed rounded-3xl p-20 text-center">
            <FolderKanban className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-medium">No projects yet</h3>
            <p className="text-muted-foreground mt-3 mb-8">
              Create your first project to get started
            </p>
            <CreateProjectModal />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border rounded-2xl p-6 hover:border-violet-500 transition-colors"
              >
                <h3 className="font-semibold text-xl">{project.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {project.description}
                </p>
                <div className="mt-6 text-xs text-muted-foreground">
                  In {project.workspace.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
