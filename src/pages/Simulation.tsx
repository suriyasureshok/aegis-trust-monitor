import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  RefreshCw,
  MapPin,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttackResult {
  type: string;
  cryptoResult: "failed" | "passed";
  trustDrop: boolean;
  newTrustScore: number;
  decision: "REJECTED" | "ACCEPTED";
  safeMode: "RTL" | "HOLD" | null;
  reason: string;
}

const attacks = [
  {
    id: "mitm",
    icon: Wifi,
    title: "MITM Attack",
    description: "Simulates man-in-the-middle command injection",
    color: "destructive" as const,
  },
  {
    id: "replay",
    icon: RefreshCw,
    title: "Replay Attack",
    description: "Simulates capture and replay of valid commands",
    color: "warning" as const,
  },
  {
    id: "gps",
    icon: MapPin,
    title: "GPS Jump",
    description: "Simulates sudden GPS position spoofing",
    color: "destructive" as const,
  },
];

export default function Simulation() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<AttackResult | null>(null);

  const simulateAttack = (attackId: string) => {
    setIsSimulating(true);
    setResult(null);

    // Simulate processing delay
    setTimeout(() => {
      const results: Record<string, AttackResult> = {
        mitm: {
          type: "Man-in-the-Middle Attack",
          cryptoResult: "failed",
          trustDrop: true,
          newTrustScore: 0.12,
          decision: "REJECTED",
          safeMode: "RTL",
          reason: "Cryptographic signature mismatch - unauthorized command source",
        },
        replay: {
          type: "Replay Attack",
          cryptoResult: "failed",
          trustDrop: false,
          newTrustScore: 0.45,
          decision: "REJECTED",
          safeMode: "HOLD",
          reason: "Nonce already used - replay attack detected",
        },
        gps: {
          type: "GPS Spoofing Attack",
          cryptoResult: "passed",
          trustDrop: true,
          newTrustScore: 0.08,
          decision: "REJECTED",
          safeMode: "RTL",
          reason: "Impossible position delta - behavioral anomaly detected",
        },
      };

      setResult(results[attackId]);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-foreground">
            Attack Simulation
          </h1>
          <p className="mt-1 text-muted-foreground">
            Test AEGIS security response against various attack vectors
          </p>
        </div>

        {/* Attack Buttons */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {attacks.map((attack) => (
            <motion.div
              key={attack.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => simulateAttack(attack.id)}
                disabled={isSimulating}
                className={cn(
                  "w-full rounded-xl border-2 p-6 text-left transition-all",
                  "border-border bg-card hover:border-destructive/50 hover:bg-destructive/5",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <attack.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-semibold text-foreground">
                      {attack.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {attack.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Simulation Progress */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 rounded-xl border border-warning/50 bg-warning/5 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Shield className="h-10 w-10 text-warning animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-lg font-semibold text-warning">
                    Simulating Attack...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AEGIS is processing the threat
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-warning border-t-transparent" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attack Result */}
        <AnimatePresence>
          {result && !isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Banner */}
              <div className="rounded-xl border-2 border-accent/50 bg-accent/5 p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-12 w-12 text-accent" />
                  <div>
                    <h3 className="font-mono text-2xl font-bold text-accent text-glow-accent">
                      Attack Successfully Mitigated
                    </h3>
                    <p className="text-muted-foreground">
                      AEGIS protected the drone from {result.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Details */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Crypto Result */}
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    result.cryptoResult === "failed"
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-accent/50 bg-accent/5"
                  )}
                >
                  <span className="text-xs text-muted-foreground">
                    Crypto Verification
                  </span>
                  <div
                    className={cn(
                      "mt-1 font-mono text-xl font-bold",
                      result.cryptoResult === "failed"
                        ? "text-destructive"
                        : "text-accent"
                    )}
                  >
                    {result.cryptoResult === "failed" ? "❌ FAILED" : "✅ PASSED"}
                  </div>
                </div>

                {/* Trust Score */}
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <span className="text-xs text-muted-foreground">
                    Trust Score Drop
                  </span>
                  <div className="mt-1 font-mono text-xl font-bold text-destructive">
                    {result.newTrustScore.toFixed(2)}
                  </div>
                </div>

                {/* Decision */}
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <span className="text-xs text-muted-foreground">Decision</span>
                  <div className="mt-1 font-mono text-xl font-bold text-destructive">
                    🚫 {result.decision}
                  </div>
                </div>

                {/* Safe Mode */}
                <div className="rounded-lg border border-warning/50 bg-warning/5 p-4">
                  <span className="text-xs text-muted-foreground">Safe Mode</span>
                  <div className="mt-1 font-mono text-xl font-bold text-warning">
                    🛡️ {result.safeMode}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <h4 className="font-mono text-sm font-semibold text-foreground">
                      Detection Reason
                    </h4>
                    <p className="mt-1 text-muted-foreground">{result.reason}</p>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Another Attack
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!result && !isSimulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"
          >
            <Shield className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 font-mono text-lg text-muted-foreground">
              Select an attack type above to simulate
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              AEGIS will demonstrate its defense capabilities
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
