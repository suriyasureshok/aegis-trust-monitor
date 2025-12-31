import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  anomaly: boolean;
}

interface FeatureExtractionProps {
  features: Feature[];
}

export function FeatureExtraction({ features }: FeatureExtractionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-mono text-lg font-semibold text-foreground">
            Feature Extraction
          </h3>
          <p className="text-sm text-muted-foreground">AI behavioral analysis input</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const TrendIcon =
            feature.trend === "up"
              ? TrendingUp
              : feature.trend === "down"
              ? TrendingDown
              : Minus;

          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-lg border p-3 transition-all",
                feature.anomaly
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-secondary/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{feature.name}</span>
                <TrendIcon
                  className={cn(
                    "h-3 w-3",
                    feature.anomaly ? "text-destructive" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={cn(
                    "font-mono text-lg font-bold",
                    feature.anomaly ? "text-destructive" : "text-foreground"
                  )}
                >
                  {feature.value.toFixed(4)}
                </span>
                <span className="text-xs text-muted-foreground">{feature.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
