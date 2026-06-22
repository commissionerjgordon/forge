'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

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
  const [currentWorkspace, setCurrentWorkspaceState] =
    useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data: Workspace[] = await res.json();
        setWorkspaces(data);

        // Auto-select logic
        if (data.length > 0 && !currentWorkspace) {
          const savedId = localStorage.getItem('currentWorkspaceId');
          const toSelect = savedId
            ? data.find((w) => w.id === savedId) || data[0]
            : data[0];

          if (toSelect) {
            setCurrentWorkspaceState(toSelect);
            localStorage.setItem('currentWorkspaceId', toSelect.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace]);

  const setCurrentWorkspace = (workspace: Workspace) => {
    setCurrentWorkspaceState(workspace);
    localStorage.setItem('currentWorkspaceId', workspace.id);
  };

  const refreshWorkspaces = async () => {
    await fetchWorkspaces();
  };

  // Initial load
  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        setCurrentWorkspace,
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
