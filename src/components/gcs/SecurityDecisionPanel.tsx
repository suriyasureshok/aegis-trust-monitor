import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export interface DecisionCard {
  id: string;
  commandType: string;
  timestamp: Date;
  decision: "ACCEPTED" | "REJECTED";
  reason: string;
}

interface CommandHistoryPanelProps {
  decisions: DecisionCard[];
}

export function CommandHistoryPanel({ decisions }: CommandHistoryPanelProps) {
  return (
    <div className="flex h-full flex-col border-l border-border bg-card/50">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="font-mono text-sm font-bold text-foreground tracking-wider">
            COMMAND HISTORY
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Recent command log</p>
      </div>

      {/* Decision Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {decisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-lg border p-3",
                decision.decision === "ACCEPTED"
                  ? "border-accent/30 bg-accent/5"
                  : "border-destructive/30 bg-destructive/5"
              )}
            >
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">
                  {decision.commandType}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-xs">
                    {decision.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div
                className={cn(
                  "mb-2 flex items-center justify-center gap-2 rounded py-2 font-mono text-sm font-bold",
                  decision.decision === "ACCEPTED"
                    ? "bg-accent/20 text-accent"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {decision.decision === "ACCEPTED" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {decision.decision}
              </div>

              {/* Reason */}
              <div className="rounded border border-border/30 bg-card/50 px-2 py-1.5">
                <span className="text-xs text-muted-foreground">Note: </span>
                <span className="text-xs text-foreground">{decision.reason}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {decisions.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-xs text-muted-foreground">
              No commands sent yet
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-secondary/20 px-4 py-2">
        <p className="text-center font-mono text-xs text-muted-foreground">
          Mission Log Active
        </p>
      </div>
    </div>
  );
}
