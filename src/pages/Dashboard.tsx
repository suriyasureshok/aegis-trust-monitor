import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CommandFeed, Command } from "@/components/dashboard/CommandFeed";
import { CryptoStatusCard } from "@/components/dashboard/CryptoStatusCard";
import { TrustScoreGauge } from "@/components/dashboard/TrustScoreGauge";
import { FeatureExtraction } from "@/components/dashboard/FeatureExtraction";
import { DecisionBanner } from "@/components/dashboard/DecisionBanner";
import { SafetyAlert } from "@/components/dashboard/SafetyAlert";

// Mock data generators
function generateCommand(): Command {
  const types: Command["type"][] = ["Waypoint", "Mode", "Velocity"];
  const sources: Command["source"][] = ["GCS", "Unknown"];
  const statuses: Command["status"][] = ["Pending", "Checked", "Rejected"];

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    type: types[Math.floor(Math.random() * types.length)],
    source: Math.random() > 0.1 ? "GCS" : "Unknown",
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}

const initialFeatures = [
  { name: "Δ Latitude", value: 0.0012, unit: "°", trend: "stable" as const, anomaly: false },
  { name: "Δ Longitude", value: 0.0008, unit: "°", trend: "up" as const, anomaly: false },
  { name: "Δ Altitude", value: 2.5, unit: "m", trend: "down" as const, anomaly: false },
  { name: "Δ Time", value: 0.5, unit: "s", trend: "stable" as const, anomaly: false },
  { name: "Velocity Δ", value: 1.2, unit: "m/s", trend: "up" as const, anomaly: false },
  { name: "Mode Trans.", value: 0, unit: "", trend: "stable" as const, anomaly: false },
];

export default function Dashboard() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [cryptoStatus, setCryptoStatus] = useState({
    aesGcm: true,
    nonce: "fresh" as "fresh" | "replayed",
    integrity: true,
  });
  const [trustScore, setTrustScore] = useState(0.91);
  const [features, setFeatures] = useState(initialFeatures);
  const [decision, setDecision] = useState<"ACCEPTED" | "REJECTED">("ACCEPTED");
  const [safeMode, setSafeMode] = useState({
    visible: false,
    mode: "RTL" as "RTL" | "HOLD",
    reason: "",
  });

  // Simulate incoming commands
  useEffect(() => {
    const interval = setInterval(() => {
      const newCommand = generateCommand();
      setCommands((prev) => [newCommand, ...prev.slice(0, 9)]);

      // Update trust score with slight variation
      const newScore = Math.max(0.3, Math.min(1, trustScore + (Math.random() - 0.5) * 0.1));
      setTrustScore(newScore);

      // Update features with slight variations
      setFeatures((prev) =>
        prev.map((f) => ({
          ...f,
          value: Math.max(0, f.value + (Math.random() - 0.5) * 0.001),
          trend: Math.random() > 0.7 ? (["up", "down", "stable"] as const)[Math.floor(Math.random() * 3)] : f.trend,
        }))
      );

      // Determine decision based on status
      const cryptoValid = cryptoStatus.aesGcm && cryptoStatus.nonce === "fresh" && cryptoStatus.integrity;
      const trustValid = newScore >= 0.6;

      if (cryptoValid && trustValid) {
        setDecision("ACCEPTED");
        setSafeMode({ visible: false, mode: "RTL", reason: "" });
      } else {
        setDecision("REJECTED");
        setSafeMode({
          visible: true,
          mode: "RTL",
          reason: !cryptoValid ? "Cryptographic failure detected" : "Behavioral anomaly detected",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [trustScore, cryptoStatus]);

  // Initialize with some commands
  useEffect(() => {
    const initialCommands = Array.from({ length: 5 }, generateCommand);
    setCommands(initialCommands);
  }, []);

  const cryptoValid = cryptoStatus.aesGcm && cryptoStatus.nonce === "fresh" && cryptoStatus.integrity;
  const trustValid = trustScore >= 0.6;

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-foreground">
            Live Command Monitor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Real-time AEGIS security verification dashboard
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Command Feed */}
          <div className="lg:col-span-2">
            <CommandFeed commands={commands} />
          </div>

          {/* Right Column - Trust Score & Features */}
          <div className="space-y-6">
            {/* Trust Score Gauge */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">
                AI Behavioral Trust Engine
              </h3>
              <TrustScoreGauge score={trustScore} threshold={0.6} />
            </div>

            {/* Feature Extraction */}
            <FeatureExtraction features={features} />
          </div>
        </div>

        {/* Crypto Status */}
        <div className="mt-6">
          <CryptoStatusCard
            aesGcm={cryptoStatus.aesGcm}
            nonce={cryptoStatus.nonce}
            integrity={cryptoStatus.integrity}
          />
        </div>

        {/* Decision Banner */}
        <div className="mt-6">
          <DecisionBanner
            decision={decision}
            cryptoValid={cryptoValid}
            trustValid={trustValid}
          />
        </div>

        {/* Safety Alert */}
        <div className="mt-6">
          <SafetyAlert
            visible={safeMode.visible}
            mode={safeMode.mode}
            reason={safeMode.reason}
          />
        </div>
      </div>
    </Layout>
  );
}
