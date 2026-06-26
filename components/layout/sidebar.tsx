'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  Kanban,
  Users,
  Settings,
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
import { useClickOutside } from '@/components/common/useClickOutside';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/board', label: 'Board', icon: Kanban },
  { href: '/workspaces', label: 'Workspaces', icon: Users },
  // { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { currentWorkspace, setCurrentWorkspace, workspaces } = useWorkspace();

  useClickOutside(sidebarRef, () => {
    if (!isDropdownOpen) {
      setIsMobileOpen(false);
    }
  });

  return (
    <div ref={sidebarRef}>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-100 md:hidden"
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
          <div className="pt-4 pl-18 pr-6 pb-6 md:p-6 border-b">
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
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              modal={false}
            >
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
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="p-4 flex items-center gap-3">
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
    </div>
  );
}
