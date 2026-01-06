import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Lock, Brain, Radio, Clock } from "lucide-react";

interface SystemStatus {
  aegisStatus: "ONLINE" | "DEGRADED" | "OFFLINE";
  cryptoLayer: "ACTIVE" | "INACTIVE";
  aiTrustEngine: "RUNNING" | "STOPPED" | "ERROR";
  droneLink: "CONNECTED" | "DISCONNECTED" | "CONNECTING";
}

interface SystemIntegrityStripProps {
  status: SystemStatus;
  lastPulse?: "success" | "warning" | "danger" | null;
}

export function SystemIntegrityStrip({ status, lastPulse }: SystemIntegrityStripProps) {
  const getStatusColor = (value: string) => {
    switch (value) {
      case "ONLINE":
      case "ACTIVE":
      case "RUNNING":
      case "CONNECTED":
        return "text-accent";
      case "DEGRADED":
      case "CONNECTING":
        return "text-warning";
      default:
        return "text-destructive";
    }
  };

  const getStatusDot = (value: string) => {
    switch (value) {
      case "ONLINE":
      case "ACTIVE":
      case "RUNNING":
      case "CONNECTED":
        return "bg-accent";
      case "DEGRADED":
      case "CONNECTING":
        return "bg-warning";
      default:
        return "bg-destructive";
    }
  };

  const currentTime = new Date().toISOString().slice(11, 19);

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-between border-b border-border bg-card/80 px-4 py-2 backdrop-blur-sm",
        lastPulse === "danger" && "animate-pulse bg-destructive/10",
        lastPulse === "warning" && "animate-pulse bg-warning/10"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* System ID */}
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-bold text-foreground tracking-wider">
          SYSTEM: PROJECT AEGIS
        </span>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-6">
        {/* AEGIS Status */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full animate-pulse", getStatusDot(status.aegisStatus))} />
          <span className="text-xs text-muted-foreground">AEGIS:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.aegisStatus))}>
            {status.aegisStatus}
          </span>
        </div>

        {/* Crypto Layer */}
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">CRYPTO:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.cryptoLayer))}>
            {status.cryptoLayer}
          </span>
        </div>

        {/* AI Trust Engine */}
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">AI ENGINE:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.aiTrustEngine))}>
            {status.aiTrustEngine}
          </span>
        </div>

        {/* Drone Link */}
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">ARDUPILOT SITL:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.droneLink))}>
            {status.droneLink}
          </span>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-xs text-muted-foreground">UTC</span>
        <span className="font-mono text-sm font-semibold text-foreground">{currentTime}</span>
      </div>

      {/* Subtle scan line effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="scan-line h-full w-full opacity-30" />
      </div>
    </motion.div>
  );
}
