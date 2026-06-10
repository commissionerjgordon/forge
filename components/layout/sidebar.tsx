'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './theme-toggle';
import { useWorkspace } from '@/components/providers/workspace-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/workspaces', label: 'Workspaces', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { currentWorkspace, setCurrentWorkspace, workspaces } = useWorkspace();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r bg-card transform transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Forge</h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  build together
                </p>
              </div>
            </div>
          </div>

          {/* Workspace Selector */}
          <div className="px-4 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {currentWorkspace?.name || 'Select Workspace'}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start">
                {workspaces.length > 0 ? (
                  workspaces.map((ws) => (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => setCurrentWorkspace(ws)}
                      className={
                        currentWorkspace?.id === ws.id ? 'bg-accent' : ''
                      }
                    >
                      {ws.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No workspaces yet
                  </DropdownMenuItem>
                )}
                <Separator className="my-1" />
                <DropdownMenuItem>
                  <Plus size={16} className="mr-2" />
                  New Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* New Project Button */}
          <div className="p-4">
            <Button className="w-full justify-start gap-2" size="lg">
              <Plus size={20} />
              New Project
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <Separator />

          {/* Bottom Section */}
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
