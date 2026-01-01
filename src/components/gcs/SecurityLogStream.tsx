import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

export type LogLevel = "info" | "success" | "warning" | "error";

export interface LogEntry {
  id: string;
  timestamp: Date;
  category: string;
  message: string;
  level: LogLevel;
}

interface SecurityLogStreamProps {
  logs: LogEntry[];
}

export function SecurityLogStream({ logs }: SecurityLogStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "success":
        return "text-accent";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CMD_RECEIVED":
        return "text-primary";
      case "CRYPTO_OK":
        return "text-accent";
      case "CRYPTO_FAIL":
        return "text-destructive";
      case "AI_SCORE":
        return "text-warning";
      case "DECISION":
        return "text-foreground";
      case "SAFE_MODE":
        return "text-warning";
      case "ANOMALY":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full flex-col border-t border-border bg-card/80">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Terminal className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-bold text-foreground tracking-wider">
          SECURITY LOG STREAM
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-xs text-muted-foreground">LIVE</span>
        </div>
      </div>

      {/* Log Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-background/50 p-2 font-mono text-xs"
        style={{ maxHeight: "200px" }}
      >
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2 py-0.5"
          >
            <span className="shrink-0 text-muted-foreground">
              [{log.timestamp.toLocaleTimeString("en-US", { hour12: false })}]
            </span>
            <span className={cn("shrink-0 font-bold", getCategoryColor(log.category))}>
              {log.category}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className={getLevelColor(log.level)}>{log.message}</span>
          </motion.div>
        ))}

        {logs.length === 0 && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span>Awaiting system events...</span>
          </div>
        )}
      </div>

      {/* Educational Micro-copy */}
      <div className="border-t border-border/30 bg-secondary/20 px-4 py-1">
        <p className="text-center font-mono text-xs italic text-muted-foreground">
          "Physics cannot be forged" — Behavioral consistency enforced
        </p>
      </div>
    </div>
  );
}
