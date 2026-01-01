import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";

interface AnomalyAlertProps {
  visible: boolean;
  message: string;
  reason: string;
}

export function AnomalyAlert({ visible, message, reason }: AnomalyAlertProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-x-0 top-16 z-50 mx-auto max-w-2xl px-4"
        >
          <div className="relative overflow-hidden rounded-lg border-2 border-destructive bg-destructive/10 p-4 backdrop-blur-md">
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 bg-destructive/20"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </motion.div>

              <div className="flex-1">
                <h3 className="font-mono text-lg font-bold text-destructive">
                  {message}
                </h3>
                <p className="mt-1 font-mono text-sm text-destructive/80">
                  {reason}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded bg-accent/20 px-3 py-1.5">
                <Shield className="h-4 w-4 text-accent" />
                <span className="font-mono text-sm font-bold text-accent">MITIGATED</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
