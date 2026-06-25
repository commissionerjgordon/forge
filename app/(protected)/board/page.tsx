'use client';

import { useWorkspace } from '@/components/providers/workspace-provider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function BoardRedirectPage() {
  const { currentWorkspace } = useWorkspace();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToDefaultBoard = async () => {
      if (!currentWorkspace?.id) {
        router.push('/projects');
        return;
      }

      try {
        // Better: Let's fetch the first board directly
        const boardRes = await fetch(
          `/api/boards?workspaceId=${currentWorkspace.id}`
        );

        if (boardRes.ok) {
          const boards = await boardRes.json();

          if (boards.length > 0) {
            // Go to the first board (we can make one "default" later)
            router.push(`/board/${boards[0].id}`);
          } else {
            // No boards yet → go to projects
            router.push('/projects');
          }
        } else {
          router.push('/projects');
        }
      } catch (error) {
        console.error(error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    redirectToDefaultBoard();
  }, [currentWorkspace, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-muted-foreground">Loading your board...</p>
        </div>
      </div>
    );
  }

  return null;
}
