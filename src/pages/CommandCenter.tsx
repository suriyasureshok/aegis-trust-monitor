import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, Terminal, Activity, Network, Zap, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SystemIntegrityStrip } from "@/components/gcs/SystemIntegrityStrip";
import { CommandConsole, Command, CommandStatus } from "@/components/gcs/CommandConsole";
import { DroneSimulation3D } from "@/components/gcs/DroneSimulation3D";
import { CommandHistoryPanel, DecisionCard } from "@/components/gcs/SecurityDecisionPanel";
import { SecurityLogStream, LogEntry, LogLevel } from "@/components/gcs/SecurityLogStream";
import { AnomalyAlert } from "@/components/gcs/AnomalyAlert";

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function CommandCenter() {
  const location = useLocation();

  // System status
  const [systemStatus, setSystemStatus] = useState<{
    gcsStatus: "ONLINE" | "DEGRADED" | "OFFLINE";
    droneLink: "CONNECTED" | "DISCONNECTED" | "CONNECTING";
    gpsStatus: "3D_FIX" | "2D_FIX" | "NO_FIX";
    batteryLevel: number;
  }>({
    gcsStatus: "ONLINE",
    droneLink: "CONNECTED",
    gpsStatus: "3D_FIX",
    batteryLevel: 85,
  });

  // Telemetry data
  const [telemetry, setTelemetry] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 0,
    speed: 0,
    heading: 0,
    flightMode: "STABILIZE",
  });

  // Command queue
  const [commands, setCommands] = useState<Command[]>([]);
  const [decisions, setDecisions] = useState<DecisionCard[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Blocked state
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string | undefined>();

  // Anomaly alert
  const [anomalyAlert, setAnomalyAlert] = useState({
    visible: false,
    message: "",
    reason: "",
  });

  // Status pulse for top bar
  const [lastPulse, setLastPulse] = useState<"success" | "warning" | "danger" | null>(null);

  // Add log entry
  const addLog = useCallback((category: string, message: string, level: LogLevel) => {
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: new Date(),
      category,
      message,
      level,
    };
    setLogs((prev) => [...prev.slice(-100), newLog]); // Keep last 100 logs
  }, []);

  // Process command
  const processCommand = useCallback(
    (command: Command) => {
      // Simulate command validation (simple success/failure)
      const isSuccess = Math.random() > 0.2; // 80% success rate

      // Generate reason
      let reason = "";
      if (!isSuccess) {
        const reasons = [
          "Command timeout",
          "Invalid parameters",
          "Drone not ready",
          "Outside flight zone",
        ];
        reason = reasons[Math.floor(Math.random() * reasons.length)];
      } else {
        reason = "Command executed successfully";
      }

      const decision: "ACCEPTED" | "REJECTED" = isSuccess ? "ACCEPTED" : "REJECTED";

      // Create decision card
      const decisionCard: DecisionCard = {
        id: generateId(),
        commandType: command.type,
        timestamp: new Date(),
        decision,
        reason,
      };

      // Add logs
      addLog("CMD_RECEIVED", command.type, "info");
      addLog("DECISION", decision, decision === "ACCEPTED" ? "success" : "error");

      // Update state
      setDecisions((prev) => [decisionCard, ...prev.slice(0, 9)]); // Keep last 10

      // Update command status
      setCommands((prev) =>
        prev.map((c) =>
          c.id === command.id ? { ...c, status: decision as CommandStatus } : c
        )
      );

      // Handle rejection
      if (decision === "REJECTED") {
        setLastPulse("danger");
        setIsBlocked(true);
        setBlockReason(reason);

        // Show anomaly alert for failures
        setAnomalyAlert({
          visible: true,
          message: "COMMAND FAILED",
          reason,
        });

        setTimeout(() => setAnomalyAlert({ ...anomalyAlert, visible: false }), 2000);

        setTimeout(() => {
          setIsBlocked(false);
          setBlockReason(undefined);
          setLastPulse(null);
        }, 2000);

        setTimeout(() => {
          setIsBlocked(false);
          setBlockReason(undefined);
          setLastPulse(null);
        }, 2000);
      } else {
        setLastPulse("success");
        setTimeout(() => setLastPulse(null), 1000);

        // Update telemetry for accepted commands
        if (command.type === "TAKEOFF") {
          setTelemetry((prev) => ({
            ...prev,
            altitude: (command.params?.altitude as number) || 10,
            flightMode: "GUIDED",
          }));
        } else if (command.type === "LAND") {
          setTelemetry((prev) => ({ ...prev, altitude: 0, flightMode: "LAND" }));
        } else if (command.type === "RTL") {
          setTelemetry((prev) => ({ ...prev, flightMode: "RTL" }));
        } else if (command.type === "GOTO" && command.params) {
          setTelemetry((prev) => ({
            ...prev,
            latitude: command.params!.lat as number,
            longitude: command.params!.lon as number,
            altitude: command.params!.alt as number,
            flightMode: "GUIDED",
          }));
        }
      }
    },
    [addLog, anomalyAlert]
  );

  // Handle command send
  const handleCommandSend = useCallback(
    (commandData: Omit<Command, "id" | "status" | "timestamp">) => {
      const newCommand: Command = {
        ...commandData,
        id: generateId(),
        status: "CREATED",
        timestamp: new Date(),
      };

      setCommands((prev) => [...prev, newCommand]);

      // Simulate command lifecycle
      setTimeout(() => {
        setCommands((prev) =>
          prev.map((c) => (c.id === newCommand.id ? { ...c, status: "SENT" } : c))
        );
      }, 200);

      setTimeout(() => {
        setCommands((prev) =>
          prev.map((c) => (c.id === newCommand.id ? { ...c, status: "VALIDATING" } : c))
        );
      }, 500);

      setTimeout(() => {
        processCommand(newCommand);
      }, 1500);
    },
    [processCommand]
  );

  // Simulate telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBlocked) {
        setTelemetry((prev) => ({
          ...prev,
          heading: (prev.heading + Math.random() * 2 - 1 + 360) % 360,
          speed: Math.max(0, prev.speed + (Math.random() * 0.4 - 0.2)),
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked]);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render for clock update
      setSystemStatus((prev) => ({ ...prev }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-border bg-sidebar flex flex-col items-center py-4">
        <div className="mb-6">
          <Compass className="h-8 w-8 text-primary" />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-2">
          {[
            { path: "/", icon: Home, label: "Home" },
            { path: "/command-center", icon: Terminal, label: "Command Center" },
            { path: "/dashboard", icon: Activity, label: "Dashboard" },
            { path: "/architecture", icon: Network, label: "Architecture" },
            { path: "/simulation", icon: Zap, label: "Simulation" },
            { path: "/logs", icon: FileText, label: "Logs" },
            { path: "/about", icon: Info, label: "About" },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              title={item.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-16 flex flex-1 flex-col">
      {/* Anomaly Alert Overlay */}
      <AnomalyAlert
        visible={anomalyAlert.visible}
        message={anomalyAlert.message}
        reason={anomalyAlert.reason}
      />

      {/* Top Bar - System Integrity Strip */}
      <SystemIntegrityStrip status={systemStatus} lastPulse={lastPulse} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Command Console */}
        <div className="w-64 shrink-0">
          <CommandConsole
            onCommandSend={handleCommandSend}
            pendingCommands={commands}
            disabled={systemStatus.gcsStatus === "OFFLINE"}
          />
        </div>

        {/* Center Panel - 3D Drone Simulation (Expanded) */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative flex-1">
            <DroneSimulation3D
              telemetry={telemetry}
              isBlocked={isBlocked}
              blockReason={blockReason}
            />
          </div>

          {/* Bottom Panel - Event Log */}
          <div className="h-36 shrink-0">
            <SecurityLogStream logs={logs} />
          </div>
        </div>

        {/* Right Panel - Command History */}
        <div className="w-72 shrink-0">
          <CommandHistoryPanel decisions={decisions} />
        </div>
        </div>
      </div>
    </div>
  );
}
