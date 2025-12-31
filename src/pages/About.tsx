import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Shield,
  AlertTriangle,
  Lock,
  Brain,
  Layers,
  Users,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    icon: AlertTriangle,
    title: "The Problem",
    content:
      "MAVLink, the standard drone communication protocol, has no built-in security. Commands are transmitted in plaintext with no authentication, making drones vulnerable to interception, spoofing, and hijacking attacks.",
  },
  {
    icon: Shield,
    title: "Our Solution",
    content:
      "AEGIS implements a zero-trust security model that treats every incoming command as potentially malicious. By combining cryptographic verification with AI-powered behavioral analysis, we ensure only legitimate commands reach the flight controller.",
  },
  {
    icon: Layers,
    title: "Defense-in-Depth",
    content:
      "Multiple independent verification layers work together: AES-256-GCM encryption validates command authenticity, while machine learning models analyze command patterns for behavioral anomalies. Even if one layer fails, others continue protecting the drone.",
  },
  {
    icon: Brain,
    title: "Zero-Trust Autonomy",
    content:
      "AEGIS doesn't just check signatures—it reasons about commands. By learning expected behavioral patterns, the AI engine can detect sophisticated attacks that bypass cryptographic checks, such as insider threats or compromised ground stations.",
  },
];

export default function About() {
  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-mono text-3xl font-bold text-foreground">
            About AEGIS
          </h1>
          <p className="mt-1 text-muted-foreground">
            Research project for secure drone autonomy
          </p>
        </div>

        {/* Hero Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center"
        >
          <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
          <blockquote className="font-mono text-2xl font-medium text-foreground">
            "Even valid commands are questioned."
          </blockquote>
          <p className="mt-4 text-muted-foreground">
            The core philosophy of zero-trust drone security
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-mono text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-xl border border-border bg-card p-8"
        >
          <h2 className="mb-6 font-mono text-xl font-semibold text-foreground">
            Technical Specifications
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Encryption", value: "AES-256-GCM" },
              { label: "Key Exchange", value: "ECDH P-256" },
              { label: "AI Model", value: "Isolation Forest / LSTM" },
              { label: "Protocol", value: "MAVLink 2.0" },
              { label: "Platform", value: "Raspberry Pi / Jetson" },
              { label: "Latency", value: "< 10ms overhead" },
            ].map((spec) => (
              <div key={spec.label} className="rounded-lg bg-secondary/30 p-4">
                <span className="text-xs text-muted-foreground">{spec.label}</span>
                <p className="mt-1 font-mono text-sm font-medium text-foreground">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 rounded-xl border border-border bg-card p-8"
        >
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="font-mono text-xl font-semibold text-foreground">
              Project Team
            </h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            AEGIS is a research project developed to demonstrate practical
            applications of AI-enhanced cybersecurity for autonomous systems.
            The project showcases defense-in-depth principles for protecting
            critical infrastructure from sophisticated cyber attacks.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Research Paper
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub Repository
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
