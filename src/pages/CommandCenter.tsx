import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { SystemIntegrityStrip } from "@/components/gcs/SystemIntegrityStrip";
import { CommandConsole, Command, CommandStatus } from "@/components/gcs/CommandConsole";
import { DroneSimulation3D } from "@/components/gcs/DroneSimulation3D";
import { SecurityDecisionPanel, DecisionCard } from "@/components/gcs/SecurityDecisionPanel";
import { SecurityLogStream, LogEntry, LogLevel } from "@/components/gcs/SecurityLogStream";
import { AnomalyAlert } from "@/components/gcs/AnomalyAlert";

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function CommandCenter() {
  // System status
  const [systemStatus, setSystemStatus] = useState<{
    aegisStatus: "ONLINE" | "DEGRADED" | "OFFLINE";
    cryptoLayer: "ACTIVE" | "INACTIVE";
    aiTrustEngine: "RUNNING" | "STOPPED" | "ERROR";
    droneLink: "CONNECTED" | "DISCONNECTED" | "CONNECTING";
  }>({
    aegisStatus: "ONLINE",
    cryptoLayer: "ACTIVE",
    aiTrustEngine: "RUNNING",
    droneLink: "CONNECTED",
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

  // Process command through AEGIS validation
  const processCommand = useCallback(
    (command: Command) => {
      // Simulate crypto validation
      const cryptoValid = Math.random() > 0.2; // 80% pass rate
      const cryptoReason = cryptoValid
        ? "AES-GCM verified"
        : Math.random() > 0.5
        ? "Replay detected"
        : "Integrity failure";

      // Simulate AI trust score (-1 to +1)
      let aiScore = cryptoValid ? (Math.random() * 1.4 - 0.2) : (Math.random() * 0.8 - 0.8);
      
      // Special case for suspicious GOTO commands
      if (command.type === "GOTO" && command.params) {
        const alt = command.params.alt as number;
        if (alt > 100) {
          aiScore = -0.5 - Math.random() * 0.5; // Negative score for suspicious altitude
        }
      }

      aiScore = Math.max(-1, Math.min(1, aiScore)); // Clamp to [-1, 1]

      // Decision logic
      const decision: "ACCEPTED" | "REJECTED" = cryptoValid && aiScore >= 0 ? "ACCEPTED" : "REJECTED";

      // Generate reason
      let reason = "";
      if (!cryptoValid) {
        reason = `Cryptographic ${cryptoReason.toLowerCase()}`;
      } else if (aiScore < 0) {
        const reasons = [
          "Implied velocity exceeds physical limits",
          "Behavioral anomaly detected",
          "Sudden trajectory deviation",
          "Command sequence inconsistent",
        ];
        reason = reasons[Math.floor(Math.random() * reasons.length)];
      } else {
        reason = "Command validated and authorized";
      }

      // Create decision card
      const decisionCard: DecisionCard = {
        id: generateId(),
        commandType: command.type,
        timestamp: new Date(),
        crypto: { valid: cryptoValid, reason: cryptoReason },
        aiTrustScore: aiScore,
        decision,
        reason,
      };

      // Add logs
      addLog("CMD_RECEIVED", command.type, "info");
      addLog(cryptoValid ? "CRYPTO_OK" : "CRYPTO_FAIL", cryptoReason, cryptoValid ? "success" : "error");
      addLog("AI_SCORE", aiScore.toFixed(2), aiScore >= 0 ? "success" : "warning");
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

        // Show anomaly alert for certain cases
        if (!cryptoValid || aiScore < -0.3) {
          setAnomalyAlert({
            visible: true,
            message: "ANOMALOUS COMMAND SEQUENCE DETECTED",
            reason,
          });

          // Trigger safe mode
          const safeMode = aiScore < -0.5 ? "RTL" : "HOLD";
          addLog("SAFE_MODE", safeMode === "RTL" ? "Return to Launch" : "Hold Position", "warning");
          setTelemetry((prev) => ({ ...prev, flightMode: safeMode }));

          setTimeout(() => setAnomalyAlert({ ...anomalyAlert, visible: false }), 4000);
        }

        setTimeout(() => {
          setIsBlocked(false);
          setBlockReason(undefined);
          setLastPulse(null);
        }, 3000);
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
    <div className="flex h-screen w-full flex-col bg-background">
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
        <div className="w-72 shrink-0">
          <CommandConsole
            onCommandSend={handleCommandSend}
            pendingCommands={commands}
            disabled={systemStatus.aegisStatus === "OFFLINE"}
          />
        </div>

        {/* Center Panel - 3D Drone Simulation */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1">
            <DroneSimulation3D
              telemetry={telemetry}
              isBlocked={isBlocked}
              blockReason={blockReason}
            />
          </div>

          {/* Bottom Panel - Security Log Stream */}
          <SecurityLogStream logs={logs} />
        </div>

        {/* Right Panel - Security Decision Engine */}
        <div className="w-80 shrink-0">
          <SecurityDecisionPanel decisions={decisions} />
        </div>
      </div>
    </div>
  );
}
