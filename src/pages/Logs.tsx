import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileDown, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  command: string;
  cryptoResult: "pass" | "fail";
  trustScore: number;
  decision: "ACCEPTED" | "REJECTED";
  action: string | null;
}

// Generate mock log data
const generateLogs = (): LogEntry[] => {
  const commands = [
    "SET_POSITION_TARGET",
    "SET_MODE",
    "SET_VELOCITY",
    "WAYPOINT",
    "ARM_DISARM",
  ];
  const actions = ["RTL", "HOLD", null, null, null];

  return Array.from({ length: 20 }, (_, i) => {
    const cryptoResult = Math.random() > 0.15 ? "pass" : "fail";
    const trustScore = cryptoResult === "fail" ? Math.random() * 0.4 : 0.5 + Math.random() * 0.5;
    const decision = cryptoResult === "pass" && trustScore >= 0.6 ? "ACCEPTED" : "REJECTED";

    return {
      id: (20 - i).toString().padStart(4, "0"),
      timestamp: new Date(Date.now() - i * 5000).toISOString().replace("T", " ").substring(0, 19),
      command: commands[Math.floor(Math.random() * commands.length)],
      cryptoResult,
      trustScore,
      decision,
      action: decision === "REJECTED" ? actions[Math.floor(Math.random() * 2)] : null,
    };
  });
};

export default function Logs() {
  const [logs] = useState<LogEntry[]>(generateLogs);
  const [filter, setFilter] = useState<"all" | "accepted" | "rejected">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "accepted") return log.decision === "ACCEPTED";
    return log.decision === "REJECTED";
  });

  const exportLogs = (format: "csv" | "json") => {
    let content: string;
    let filename: string;
    let type: string;

    if (format === "csv") {
      const headers = "ID,Timestamp,Command,Crypto,Trust Score,Decision,Action\n";
      const rows = filteredLogs
        .map(
          (log) =>
            `${log.id},${log.timestamp},${log.command},${log.cryptoResult},${log.trustScore.toFixed(2)},${log.decision},${log.action || ""}`
        )
        .join("\n");
      content = headers + rows;
      filename = "aegis_logs.csv";
      type = "text/csv";
    } else {
      content = JSON.stringify(filteredLogs, null, 2);
      filename = "aegis_logs.json";
      type = "application/json";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold text-foreground">
              Audit Logs
            </h1>
            <p className="mt-1 text-muted-foreground">
              Complete command verification history
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportLogs("csv")} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportLogs("json")} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter:</span>
          </div>
          {(["all", "accepted", "rejected"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={cn(
                filter === f && f === "accepted" && "bg-accent text-accent-foreground",
                filter === f && f === "rejected" && "bg-destructive text-destructive-foreground"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Logs Table */}
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  TIMESTAMP
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  COMMAND
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  CRYPTO
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  TRUST
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  DECISION
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-muted/20",
                    log.decision === "REJECTED" && "bg-destructive/5"
                  )}
                >
                  <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                    #{log.id}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">
                    {log.command}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={log.cryptoResult === "pass" ? "valid" : "invalid"}
                      label={log.cryptoResult.toUpperCase()}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-mono text-sm font-medium",
                        log.trustScore >= 0.6 ? "text-accent" : "text-destructive"
                      )}
                    >
                      {log.trustScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={log.decision === "ACCEPTED" ? "valid" : "invalid"}
                      label={log.decision}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {log.action ? (
                      <span className="rounded bg-warning/10 px-2 py-1 font-mono text-xs text-warning">
                        {log.action}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-8 text-sm text-muted-foreground">
          <span>
            Total: <span className="font-mono text-foreground">{logs.length}</span> entries
          </span>
          <span>
            Accepted:{" "}
            <span className="font-mono text-accent">
              {logs.filter((l) => l.decision === "ACCEPTED").length}
            </span>
          </span>
          <span>
            Rejected:{" "}
            <span className="font-mono text-destructive">
              {logs.filter((l) => l.decision === "REJECTED").length}
            </span>
          </span>
        </div>
      </div>
    </Layout>
  );
}
