import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "valid" | "invalid" | "pending" | "warning";
  label?: string;
  className?: string;
}

const statusConfig = {
  valid: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/30",
    dot: "bg-accent",
  },
  invalid: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    dot: "bg-destructive",
  },
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)} />
      {label || status.toUpperCase()}
    </span>
  );
}
