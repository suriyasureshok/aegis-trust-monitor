import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
          {/* Scan line effect */}
          <div className="pointer-events-none absolute inset-0 scan-line" />
          {/* Content */}
          <div className="relative z-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
