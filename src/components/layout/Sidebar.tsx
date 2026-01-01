import { NavLink, useLocation } from "react-router-dom";
import { Shield, Activity, Network, Zap, FileText, Info, Home, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/command-center", label: "Command Center", icon: Terminal },
  { path: "/dashboard", label: "Live Monitor", icon: Activity },
  { path: "/architecture", label: "Architecture", icon: Network },
  { path: "/simulation", label: "Attack Sim", icon: Zap },
  { path: "/logs", label: "Audit Logs", icon: FileText },
  { path: "/about", label: "About", icon: Info },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="relative">
            <Shield className="h-10 w-10 text-primary" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Shield className="h-10 w-10 text-primary opacity-50 blur-sm" />
            </div>
          </div>
          <div>
            <h1 className="font-mono text-xl font-bold tracking-wider text-foreground">
              AEGIS
            </h1>
            <p className="text-xs text-muted-foreground">Zero-Trust Autonomy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary box-glow-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-glow-primary")} />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent">SYSTEM ACTIVE</span>
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              v1.0.0-beta
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
