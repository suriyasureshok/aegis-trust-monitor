import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Radio, Clock, Compass, Battery, Signal } from "lucide-react";

interface SystemStatus {
  gcsStatus: "ONLINE" | "DEGRADED" | "OFFLINE";
  droneLink: "CONNECTED" | "DISCONNECTED" | "CONNECTING";
  gpsStatus: "3D_FIX" | "2D_FIX" | "NO_FIX";
  batteryLevel: number;
}

interface SystemIntegrityStripProps {
  status: SystemStatus;
  lastPulse?: "success" | "warning" | "danger" | null;
}

export function SystemIntegrityStrip({ status, lastPulse }: SystemIntegrityStripProps) {
  const getStatusColor = (value: string) => {
    switch (value) {
      case "ONLINE":
      case "CONNECTED":
      case "3D_FIX":
        return "text-accent";
      case "DEGRADED":
      case "CONNECTING":
      case "2D_FIX":
        return "text-warning";
      default:
        return "text-destructive";
    }
  };

  const getStatusDot = (value: string) => {
    switch (value) {
      case "ONLINE":
      case "CONNECTED":
      case "3D_FIX":
        return "bg-accent";
      case "DEGRADED":
      case "CONNECTING":
      case "2D_FIX":
        return "bg-warning";
      default:
        return "bg-destructive";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-accent";
    if (level > 20) return "text-warning";
    return "text-destructive";
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
        <Compass className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-bold text-foreground tracking-wider">
          GCS CONTROL
        </span>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-6">
        {/* GCS Status */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full animate-pulse", getStatusDot(status.gcsStatus))} />
          <span className="text-xs text-muted-foreground">GCS:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.gcsStatus))}>
            {status.gcsStatus}
          </span>
        </div>

        {/* Drone Link */}
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">LINK:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.droneLink))}>
            {status.droneLink}
          </span>
        </div>

        {/* GPS Status */}
        <div className="flex items-center gap-2">
          <Signal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">GPS:</span>
          <span className={cn("font-mono text-xs font-semibold", getStatusColor(status.gpsStatus))}>
            {status.gpsStatus}
          </span>
        </div>

        {/* Battery */}
        <div className="flex items-center gap-2">
          <Battery className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">BAT:</span>
          <span className={cn("font-mono text-xs font-semibold", getBatteryColor(status.batteryLevel))}>
            {status.batteryLevel}%
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
