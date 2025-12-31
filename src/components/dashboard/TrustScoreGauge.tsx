import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrustScoreGaugeProps {
  score: number;
  threshold?: number;
}

export function TrustScoreGauge({ score, threshold = 0.6 }: TrustScoreGaugeProps) {
  const isAboveThreshold = score >= threshold;
  const percentage = score * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-32 w-32">
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Threshold marker */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.3)"
            strokeWidth="8"
            strokeDasharray={`${threshold * circumference} ${circumference}`}
            className="opacity-50"
          />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isAboveThreshold ? "hsl(var(--accent))" : "hsl(var(--destructive))"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: isAboveThreshold
                ? "drop-shadow(0 0 8px hsl(var(--accent) / 0.6))"
                : "drop-shadow(0 0 8px hsl(var(--destructive) / 0.6))",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "font-mono text-2xl font-bold",
              isAboveThreshold ? "text-accent text-glow-accent" : "text-destructive text-glow-destructive"
            )}
          >
            {score.toFixed(2)}
          </motion.span>
          <span className="text-xs text-muted-foreground">Trust Score</span>
        </div>
      </div>

      {/* Threshold indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div className="h-px w-8 bg-muted-foreground/50" />
        <span className="text-muted-foreground">
          Threshold: <span className="font-mono text-foreground">{threshold}</span>
        </span>
        <div className="h-px w-8 bg-muted-foreground/50" />
      </div>

      {/* Status */}
      <div
        className={cn(
          "rounded-full px-3 py-1 font-mono text-xs font-medium",
          isAboveThreshold
            ? "bg-accent/10 text-accent"
            : "bg-destructive/10 text-destructive"
        )}
      >
        {isAboveThreshold ? "✓ TRUSTED" : "✗ UNTRUSTED"}
      </div>
    </div>
  );
}
