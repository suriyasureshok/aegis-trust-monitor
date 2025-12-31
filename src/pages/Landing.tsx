import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Lock, Brain, Zap, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Lock,
    title: "Cryptographic Verification",
    description:
      "AES-256-GCM encryption with nonce freshness checks prevents replay attacks and command spoofing.",
  },
  {
    icon: Brain,
    title: "AI Behavioral Trust",
    description:
      "Machine learning model evaluates command patterns against expected behavior to detect anomalies.",
  },
  {
    icon: Zap,
    title: "Autonomous Safe-Mode",
    description:
      "Instant activation of RTL or HOLD modes when threats are detected, without ground station intervention.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-4"
            >
              <div className="relative">
                <Shield className="h-20 w-20 text-primary" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="h-20 w-20 text-primary blur-md" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="font-mono text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              <span className="text-primary text-glow-primary">AEGIS</span>
            </h1>
            <p className="mt-2 font-mono text-xl text-muted-foreground md:text-2xl">
              Zero-Trust Autonomy for Drones
            </p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mt-8 max-w-2xl text-lg text-foreground/80"
            >
              <span className="border-l-2 border-primary pl-4 italic">
                "Even valid commands are questioned."
              </span>
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12"
            >
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="group gap-2 bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Activity className="h-5 w-5" />
                  Open Live Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-mono text-3xl font-bold text-foreground">
              Defense in Depth
            </h2>
            <p className="mt-2 text-muted-foreground">
              Multiple verification layers for maximum security
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 font-mono text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            This system does not blindly trust commands — it reasons about them.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/architecture">
              <Button variant="outline" className="gap-2">
                View Architecture
              </Button>
            </Link>
            <Link to="/simulation">
              <Button variant="outline" className="gap-2">
                Try Attack Simulation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
