import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Radio,
  Shield,
  Cpu,
  Lock,
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const layers = [
  {
    icon: Lock,
    title: "Crypto Layer",
    description: "AES-256-GCM encryption verification",
  },
  {
    icon: Cpu,
    title: "Feature Extraction",
    description: "Behavioral pattern analysis",
  },
  {
    icon: Brain,
    title: "AI Trust Engine",
    description: "ML-based anomaly detection",
  },
  {
    icon: CheckCircle,
    title: "Decision Engine",
    description: "Accept/Reject determination",
  },
];

export default function Architecture() {
  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-mono text-3xl font-bold text-foreground">
            System Architecture
          </h1>
          <p className="mt-1 text-muted-foreground">
            How AEGIS protects drone command integrity
          </p>
        </div>

        {/* Main Diagram */}
        <div className="mx-auto max-w-5xl">
          {/* Top Flow: GCS -> AEGIS -> FC */}
          <div className="mb-16 flex items-center justify-center gap-8">
            {/* GCS */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border-2 border-warning/50 bg-warning/10 p-6 text-center"
            >
              <Radio className="mx-auto mb-2 h-10 w-10 text-warning" />
              <h3 className="font-mono text-lg font-bold text-foreground">GCS</h3>
              <p className="text-xs text-muted-foreground">Ground Control</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </motion.div>

            {/* AEGIS */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-xl border-2 border-primary bg-primary/10 p-8 text-center"
            >
              <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md" />
              <div className="relative">
                <Shield className="mx-auto mb-2 h-14 w-14 text-primary" />
                <h3 className="font-mono text-2xl font-bold text-primary">AEGIS</h3>
                <p className="text-sm text-muted-foreground">Security Proxy</p>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </motion.div>

            {/* Flight Controller */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border-2 border-accent/50 bg-accent/10 p-6 text-center"
            >
              <Cpu className="mx-auto mb-2 h-10 w-10 text-accent" />
              <h3 className="font-mono text-lg font-bold text-foreground">
                Flight Controller
              </h3>
              <p className="text-xs text-muted-foreground">Autopilot</p>
            </motion.div>
          </div>

          {/* Arrow Down to Layers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <ArrowDown className="h-8 w-8 text-primary" />
          </motion.div>

          {/* AEGIS Internal Layers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 text-center font-mono text-lg font-semibold text-foreground">
              AEGIS Internal Architecture
            </h3>

            <div className="grid gap-4 md:grid-cols-4">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="group relative rounded-lg border border-border bg-secondary/30 p-6 text-center transition-all hover:border-primary/50"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                    <layer.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-mono text-sm font-semibold text-foreground">
                    {layer.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {layer.description}
                  </p>

                  {/* Connector line */}
                  {index < layers.length - 1 && (
                    <div className="absolute -right-2 top-1/2 hidden h-0.5 w-4 bg-border md:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Points */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Secure Proxy",
                desc: "AEGIS acts as a secure proxy between GCS and autopilot",
              },
              {
                title: "No Firmware Modification",
                desc: "Works with stock autopilot firmware, no changes required",
              },
              {
                title: "Companion Computer",
                desc: "Runs on companion computer like Raspberry Pi or Jetson",
              },
            ].map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="rounded-lg border border-border bg-card/50 p-6"
              >
                <h4 className="mb-2 font-mono text-sm font-semibold text-primary">
                  {point.title}
                </h4>
                <p className="text-sm text-muted-foreground">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
