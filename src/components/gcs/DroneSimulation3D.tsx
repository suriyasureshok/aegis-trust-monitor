import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Telemetry {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  flightMode: string;
}

interface DroneSimulation3DProps {
  telemetry: Telemetry;
  isBlocked?: boolean;
  blockReason?: string;
}

function DroneModel({ isBlocked }: { isBlocked?: boolean }) {
  const droneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (droneRef.current && !isBlocked) {
      droneRef.current.rotation.y += 0.002;
      droneRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
    }
  });

  const droneColor = isBlocked ? "#ff4757" : "#00d4aa";
  const glowIntensity = isBlocked ? 2 : 1;

  return (
    <group ref={droneRef} position={[0, 1, 0]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial color={droneColor} emissive={droneColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Arms */}
      {[
        [0.4, 0, 0.4],
        [-0.4, 0, 0.4],
        [0.4, 0, -0.4],
        [-0.4, 0, -0.4],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Arm */}
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.5]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Motor */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Propeller */}
          <mesh position={[0, 0.32, 0]} rotation={[0, i * 0.5, 0]}>
            <boxGeometry args={[0.35, 0.01, 0.05]} />
            <meshStandardMaterial color="#666" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Status light */}
      <pointLight color={droneColor} intensity={glowIntensity} distance={3} position={[0, 0.2, 0]} />
    </group>
  );
}

function GroundPlane() {
  return (
    <>
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1a3a4a"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#2a5a6a"
        fadeDistance={30}
        fadeStrength={1}
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a1929" transparent opacity={0.8} />
      </mesh>
    </>
  );
}

function BlockedOverlay({ reason }: { reason?: string }) {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.25}
        color="#ff4757"
        anchorX="center"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Bold.ttf"
      >
        COMMAND BLOCKED BY AEGIS
      </Text>
      {reason && (
        <Text
          position={[0, 2.1, 0]}
          fontSize={0.12}
          color="#ff8a8a"
          anchorX="center"
          anchorY="middle"
        >
          {reason}
        </Text>
      )}
    </Float>
  );
}

export function DroneSimulation3D({ telemetry, isBlocked, blockReason }: DroneSimulation3DProps) {
  return (
    <div className="relative h-full w-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        className="bg-background"
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00d4aa" />

        <DroneModel isBlocked={isBlocked} />
        <GroundPlane />
        {isBlocked && <BlockedOverlay reason={blockReason} />}

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />

        {/* Fog for atmosphere */}
        <fog attach="fog" args={["#0a1929", 10, 30]} />
      </Canvas>

      {/* Telemetry Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute left-4 top-4 space-y-1 rounded border border-border/50 bg-card/80 p-3 backdrop-blur-sm"
      >
        <h3 className="mb-2 font-mono text-xs font-bold text-primary">TELEMETRY</h3>
        <TelemetryRow label="LAT" value={telemetry.latitude.toFixed(6)} />
        <TelemetryRow label="LON" value={telemetry.longitude.toFixed(6)} />
        <TelemetryRow label="ALT" value={`${telemetry.altitude.toFixed(1)}m`} />
        <TelemetryRow label="SPD" value={`${telemetry.speed.toFixed(1)}m/s`} />
        <TelemetryRow label="HDG" value={`${telemetry.heading.toFixed(0)}°`} />
        <TelemetryRow
          label="MODE"
          value={telemetry.flightMode}
          highlight={telemetry.flightMode === "RTL" || telemetry.flightMode === "HOLD"}
        />
      </motion.div>

      {/* Control Path Label */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded border border-border/30 bg-card/60 px-4 py-2 backdrop-blur-sm">
        <p className="font-mono text-xs text-muted-foreground">
          CONTROL PATH:{" "}
          <span className="text-primary">FRONTEND</span> →{" "}
          <span className="text-accent">AEGIS</span> →{" "}
          <span className="text-foreground">ARDUPILOT SITL</span>
        </p>
      </div>

      {/* Blocked State Overlay */}
      {isBlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-lg border-2",
            "border-destructive/50 bg-destructive/5"
          )}
        >
          <div className="absolute inset-0 animate-pulse bg-destructive/5" />
        </motion.div>
      )}
    </div>
  );
}

function TelemetryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("font-mono text-xs", highlight ? "text-warning" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}
