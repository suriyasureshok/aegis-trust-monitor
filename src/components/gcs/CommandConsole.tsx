import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Power,
  PowerOff,
  Plane,
  ArrowDown,
  Home,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export type CommandStatus = "CREATED" | "SENT" | "VALIDATING" | "ACCEPTED" | "REJECTED";

export interface Command {
  id: string;
  type: string;
  params?: Record<string, number | string>;
  status: CommandStatus;
  timestamp: Date;
}

interface CommandConsoleProps {
  onCommandSend: (command: Omit<Command, "id" | "status" | "timestamp">) => void;
  pendingCommands: Command[];
  disabled?: boolean;
}

export function CommandConsole({ onCommandSend, pendingCommands, disabled }: CommandConsoleProps) {
  const [takeoffAlt, setTakeoffAlt] = useState("10");
  const [gotoLat, setGotoLat] = useState("37.7749");
  const [gotoLon, setGotoLon] = useState("-122.4194");
  const [gotoAlt, setGotoAlt] = useState("50");

  const commands = [
    { id: "ARM", icon: Power, label: "ARM", color: "accent" },
    { id: "DISARM", icon: PowerOff, label: "DISARM", color: "warning" },
  ];

  const getStatusIcon = (status: CommandStatus) => {
    switch (status) {
      case "CREATED":
      case "SENT":
        return <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse" />;
      case "VALIDATING":
        return <Loader2 className="h-4 w-4 text-warning animate-spin" />;
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: CommandStatus) => {
    switch (status) {
      case "ACCEPTED":
        return "border-accent/50 bg-accent/5";
      case "REJECTED":
        return "border-destructive/50 bg-destructive/5";
      case "VALIDATING":
        return "border-warning/50 bg-warning/5";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card/50">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-mono text-sm font-bold text-foreground tracking-wider">
          SECURE COMMAND CONSOLE
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Ground Control Station</p>
      </div>

      {/* Warning Banner */}
      <div className="mx-3 mt-3 rounded border border-warning/30 bg-warning/5 px-3 py-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          <p className="text-xs text-warning/80">
            All commands are subject to cryptographic and AI-based validation.
          </p>
        </div>
      </div>

      {/* Command Buttons */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* ARM / DISARM */}
        <div className="grid grid-cols-2 gap-2">
          {commands.map((cmd) => (
            <Button
              key={cmd.id}
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onCommandSend({ type: cmd.id })}
              className={cn(
                "h-12 font-mono text-xs",
                cmd.color === "accent" && "border-accent/30 hover:border-accent hover:bg-accent/10",
                cmd.color === "warning" && "border-warning/30 hover:border-warning hover:bg-warning/10"
              )}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              {cmd.label}
            </Button>
          ))}
        </div>

        {/* TAKEOFF */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">TAKEOFF</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={takeoffAlt}
              onChange={(e) => setTakeoffAlt(e.target.value)}
              placeholder="Alt (m)"
              className="h-10 font-mono text-xs"
              disabled={disabled}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onCommandSend({ type: "TAKEOFF", params: { altitude: parseFloat(takeoffAlt) } })}
              className="h-10 shrink-0 border-accent/30 font-mono text-xs hover:border-accent hover:bg-accent/10"
            >
              <Plane className="mr-2 h-4 w-4" />
              EXECUTE
            </Button>
          </div>
        </div>

        {/* LAND */}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onCommandSend({ type: "LAND" })}
          className="h-10 w-full border-warning/30 font-mono text-xs hover:border-warning hover:bg-warning/10"
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          LAND
        </Button>

        {/* RTL */}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onCommandSend({ type: "RTL" })}
          className="h-10 w-full border-primary/30 font-mono text-xs hover:border-primary hover:bg-primary/10"
        >
          <Home className="mr-2 h-4 w-4" />
          RETURN TO LAUNCH
        </Button>

        {/* GOTO */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">GOTO POSITION</label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              value={gotoLat}
              onChange={(e) => setGotoLat(e.target.value)}
              placeholder="Lat"
              className="h-9 font-mono text-xs"
              disabled={disabled}
            />
            <Input
              type="number"
              value={gotoLon}
              onChange={(e) => setGotoLon(e.target.value)}
              placeholder="Lon"
              className="h-9 font-mono text-xs"
              disabled={disabled}
            />
            <Input
              type="number"
              value={gotoAlt}
              onChange={(e) => setGotoAlt(e.target.value)}
              placeholder="Alt"
              className="h-9 font-mono text-xs"
              disabled={disabled}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onCommandSend({
                type: "GOTO",
                params: {
                  lat: parseFloat(gotoLat),
                  lon: parseFloat(gotoLon),
                  alt: parseFloat(gotoAlt),
                },
              })
            }
            className="h-10 w-full border-primary/30 font-mono text-xs hover:border-primary hover:bg-primary/10"
          >
            <MapPin className="mr-2 h-4 w-4" />
            SEND WAYPOINT
          </Button>
        </div>
      </div>

      {/* Command Queue */}
      <div className="border-t border-border p-3">
        <h3 className="mb-2 font-mono text-xs text-muted-foreground">COMMAND PIPELINE</h3>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {pendingCommands.slice(-5).map((cmd) => (
              <motion.div
                key={cmd.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn("flex items-center justify-between rounded border px-2 py-1.5", getStatusColor(cmd.status))}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(cmd.status)}
                  <span className="font-mono text-xs text-foreground">{cmd.type}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{cmd.status}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {pendingCommands.length === 0 && (
            <p className="py-2 text-center font-mono text-xs text-muted-foreground">No pending commands</p>
          )}
        </div>
      </div>
    </div>
  );
}
