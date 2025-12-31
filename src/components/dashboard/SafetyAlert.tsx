import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Home, Pause } from "lucide-react";

interface SafetyAlertProps {
  visible: boolean;
  mode: "RTL" | "HOLD";
  reason: string;
}

export function SafetyAlert({ visible, mode, reason }: SafetyAlertProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6"
        >
          {/* Pulsing background */}
          <motion.div
            className="absolute inset-0 bg-destructive/10"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <div className="relative flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </motion.div>

            <div className="flex-1">
              <h3 className="font-mono text-lg font-bold text-destructive text-glow-destructive">
                🚨 SAFE MODE ACTIVATED
              </h3>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="rounded-lg bg-secondary/50 px-4 py-2">
                  <span className="text-xs text-muted-foreground">Mode</span>
                  <div className="flex items-center gap-2 font-mono text-lg font-bold text-foreground">
                    {mode === "RTL" ? (
                      <>
                        <Home className="h-5 w-5 text-warning" />
                        Return to Launch
                      </>
                    ) : (
                      <>
                        <Pause className="h-5 w-5 text-warning" />
                        Position Hold
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 px-4 py-2">
                  <span className="text-xs text-muted-foreground">Reason</span>
                  <p className="font-mono text-sm text-foreground">{reason}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
