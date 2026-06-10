'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Workspace = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

type WorkspaceContextType = {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
  loading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);

        // Auto-select first workspace if none selected
        if (data.length > 0 && !currentWorkspace) {
          const saved = localStorage.getItem('currentWorkspaceId');
          const found = saved
            ? data.find((w: Workspace) => w.id === saved)
            : data[0];

          if (found) {
            setCurrentWorkspace(found);
            localStorage.setItem('currentWorkspaceId', found.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch workspaces', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('currentWorkspaceId', workspace.id);
  };

  const refreshWorkspaces = async () => {
    await fetchWorkspaces();
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        setCurrentWorkspace: handleSetWorkspace,
        refreshWorkspaces,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
};
