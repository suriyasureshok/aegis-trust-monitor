import { motion } from "framer-motion";
import { Lock, Key, RefreshCw, Shield } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface CryptoStatusCardProps {
  aesGcm: boolean;
  nonce: "fresh" | "replayed";
  integrity: boolean;
}

export function CryptoStatusCard({ aesGcm, nonce, integrity }: CryptoStatusCardProps) {
  const allValid = aesGcm && nonce === "fresh" && integrity;

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 transition-all duration-300",
        allValid
          ? "border-accent/30 bg-accent/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-lg p-2",
              allValid ? "bg-accent/10" : "bg-destructive/10"
            )}
          >
            <Lock
              className={cn(
                "h-6 w-6",
                allValid ? "text-accent" : "text-destructive"
              )}
            />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold text-foreground">
              Cryptographic Verification
            </h3>
            <p className="text-sm text-muted-foreground">AES-256-GCM Layer</p>
          </div>
        </div>

        <StatusBadge status={allValid ? "valid" : "invalid"} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {/* AES-GCM */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-secondary/50 p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Key className="h-4 w-4" />
            <span className="text-xs">AES-GCM</span>
          </div>
          <div
            className={cn(
              "mt-2 font-mono text-lg font-bold",
              aesGcm ? "text-accent" : "text-destructive"
            )}
          >
            {aesGcm ? "✅ Valid" : "❌ Failed"}
          </div>
        </motion.div>

        {/* Nonce */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-secondary/50 p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Nonce</span>
          </div>
          <div
            className={cn(
              "mt-2 font-mono text-lg font-bold",
              nonce === "fresh" ? "text-accent" : "text-destructive"
            )}
          >
            {nonce === "fresh" ? "✅ Fresh" : "❌ Replayed"}
          </div>
        </motion.div>

        {/* Integrity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-secondary/50 p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Integrity</span>
          </div>
          <div
            className={cn(
              "mt-2 font-mono text-lg font-bold",
              integrity ? "text-accent" : "text-destructive"
            )}
          >
            {integrity ? "✅ Pass" : "❌ Fail"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
