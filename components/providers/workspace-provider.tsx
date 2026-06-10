'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Workspace = {
  id: string;
  name: string;
  slug: string;
};

type WorkspaceContextType = {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // For now we'll hardcode the personal workspace
  // Later we'll fetch from API

  useEffect(() => {
    // Temporary: Load from localStorage or default
    const saved = localStorage.getItem('currentWorkspace');
    if (saved) {
      setCurrentWorkspace(JSON.parse(saved));
    }
  }, []);

  const handleSetWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setCurrentWorkspace: handleSetWorkspace,
        workspaces,
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
