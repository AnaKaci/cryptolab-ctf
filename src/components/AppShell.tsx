import type { ReactNode } from "react";
import type { AppMode } from "../types/models";
import type { PageId } from "../App";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  activePage: PageId;
  mode: AppMode;
  children: ReactNode;
  onNavigate: (page: PageId) => void;
  onModeChange: (mode: AppMode) => void;
}

export function AppShell({ activePage, mode, children, onNavigate, onModeChange }: AppShellProps) {
  return (
    <div className="min-h-screen lab-grid">
      <div className="lg:hidden">
        <Sidebar activePage={activePage} mode={mode} onNavigate={onNavigate} onModeChange={onModeChange} />
      </div>
      <div className="hidden lg:block">
        <Sidebar activePage={activePage} mode={mode} onNavigate={onNavigate} onModeChange={onModeChange} />
      </div>
      <main className="px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">{children}</main>
    </div>
  );
}
