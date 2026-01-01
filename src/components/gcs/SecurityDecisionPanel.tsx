import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Shield,
  Lock,
  Brain,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DecisionCard {
  id: string;
  commandType: string;
  timestamp: Date;
  crypto: {
    valid: boolean;
    reason: string;
  };
  aiTrustScore: number;
  decision: "ACCEPTED" | "REJECTED";
  reason: string;
}

interface SecurityDecisionPanelProps {
  decisions: DecisionCard[];
}

export function SecurityDecisionPanel({ decisions }: SecurityDecisionPanelProps) {
  return (
    <div className="flex h-full flex-col border-l border-border bg-card/50">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="font-mono text-sm font-bold text-foreground tracking-wider">
            SECURITY DECISION ENGINE
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Real-time command validation</p>
      </div>

      {/* Educational Micro-copy */}
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2">
        <p className="text-center font-mono text-xs italic text-muted-foreground">
          "Authenticity does not imply safety"
        </p>
      </div>

      {/* Decision Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {decisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-lg border p-3",
                decision.decision === "ACCEPTED"
                  ? "border-accent/30 bg-accent/5"
                  : "border-destructive/30 bg-destructive/5"
              )}
            >
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">
                  {decision.commandType}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {decision.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Crypto Result */}
              <div className="mb-2 flex items-center justify-between rounded border border-border/50 bg-secondary/30 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Crypto:</span>
                </div>
                <div className="flex items-center gap-1">
                  {decision.crypto.valid ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-accent" />
                      <span className="font-mono text-xs text-accent">VALID</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                      <span className="font-mono text-xs text-destructive">FAILED</span>
                    </>
                  )}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{decision.crypto.reason}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* AI Trust Score */}
              <div className="mb-2 flex items-center justify-between rounded border border-border/50 bg-secondary/30 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">AI Trust:</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrustScoreBar score={decision.aiTrustScore} />
                  <span
                    className={cn(
                      "font-mono text-xs font-bold",
                      decision.aiTrustScore >= 0 ? "text-accent" : "text-destructive"
                    )}
                  >
                    {decision.aiTrustScore > 0 ? "+" : ""}
                    {decision.aiTrustScore.toFixed(2)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">AI validates behavior and intent</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Decision */}
              <div
                className={cn(
                  "mb-2 flex items-center justify-center gap-2 rounded py-2 font-mono text-sm font-bold",
                  decision.decision === "ACCEPTED"
                    ? "bg-accent/20 text-accent"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {decision.decision === "ACCEPTED" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {decision.decision}
              </div>

              {/* Reason */}
              <div className="rounded border border-border/30 bg-card/50 px-2 py-1.5">
                <span className="text-xs text-muted-foreground">Reason: </span>
                <span className="text-xs text-foreground">{decision.reason}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {decisions.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-xs text-muted-foreground">
              Awaiting commands...
            </p>
          </div>
        )}
      </div>

      {/* Educational Footer */}
      <div className="border-t border-border/50 bg-secondary/20 px-4 py-2">
        <p className="text-center font-mono text-xs text-muted-foreground">
          Zero-Trust Autonomy Enabled
        </p>
      </div>
    </div>
  );
}

function TrustScoreBar({ score }: { score: number }) {
  // Normalize score from [-1, 1] to [0, 100]
  const percentage = ((score + 1) / 2) * 100;

  return (
    <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          score >= 0 ? "bg-accent" : "bg-destructive"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
