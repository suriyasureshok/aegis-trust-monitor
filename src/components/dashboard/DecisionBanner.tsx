import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionBannerProps {
  decision: "ACCEPTED" | "REJECTED";
  cryptoValid: boolean;
  trustValid: boolean;
}

export function DecisionBanner({ decision, cryptoValid, trustValid }: DecisionBannerProps) {
  const isAccepted = decision === "ACCEPTED";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={decision}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 p-6",
          isAccepted
            ? "border-accent/50 bg-accent/5"
            : "border-destructive/50 bg-destructive/5"
        )}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-20 blur-3xl",
            isAccepted ? "bg-accent" : "bg-destructive"
          )}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {isAccepted ? (
                <CheckCircle2 className="h-16 w-16 text-accent" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </motion.div>

            <div>
              <h2
                className={cn(
                  "font-mono text-3xl font-bold tracking-wider",
                  isAccepted
                    ? "text-accent text-glow-accent"
                    : "text-destructive text-glow-destructive"
                )}
              >
                COMMAND {decision}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAccepted
                  ? "All verification layers passed"
                  : "Security verification failed"}
              </p>
            </div>
          </div>

          {/* Decision logic */}
          <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Decision Logic:</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className={cryptoValid ? "text-accent" : "text-destructive"}>
                  {cryptoValid ? "✔" : "✖"}
                </span>
                <span>Crypto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={trustValid ? "text-accent" : "text-destructive"}>
                  {trustValid ? "✔" : "✖"}
                </span>
                <span>AI Trust</span>
              </div>
              <div className="mt-2 border-t border-border pt-2">
                <span className="text-muted-foreground">→ </span>
                <span className={isAccepted ? "text-accent" : "text-destructive"}>
                  {decision}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
