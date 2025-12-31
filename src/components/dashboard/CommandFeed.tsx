import { motion, AnimatePresence } from "framer-motion";
import { Radio, MapPin, Compass, Gauge } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export interface Command {
  id: string;
  timestamp: string;
  type: "Waypoint" | "Mode" | "Velocity";
  source: "GCS" | "Unknown";
  status: "Pending" | "Checked" | "Rejected";
}

interface CommandFeedProps {
  commands: Command[];
}

const typeIcons = {
  Waypoint: MapPin,
  Mode: Compass,
  Velocity: Gauge,
};

export function CommandFeed({ commands }: CommandFeedProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Radio className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold text-foreground">
              Incoming Command Stream
            </h3>
            <p className="text-sm text-muted-foreground">Real-time MAVLink feed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-xs text-accent">LIVE</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                TIMESTAMP
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                COMMAND
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                SOURCE
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {commands.map((cmd, index) => {
                const Icon = typeIcons[cmd.type];
                return (
                  <motion.tr
                    key={cmd.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-border/50 transition-colors",
                      cmd.status === "Rejected" && "bg-destructive/5"
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                      {cmd.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm text-foreground">
                          {cmd.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "font-mono text-sm",
                          cmd.source === "GCS"
                            ? "text-foreground"
                            : "text-warning"
                        )}
                      >
                        {cmd.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          cmd.status === "Checked"
                            ? "valid"
                            : cmd.status === "Rejected"
                            ? "invalid"
                            : "pending"
                        }
                        label={cmd.status}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
