"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const nodeCount = 76;

function seeded(index: number) {
  const x = Math.sin(index * 999.13) * 10000;
  return x - Math.floor(x);
}

function NeuralField() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  const { nodePositions, linePositions } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i += 1) {
      const layer = i % 4;
      const angle = (i / nodeCount) * Math.PI * 2 * 3.2 + seeded(i) * 0.9;
      const radius = 1.05 + layer * 0.42 + seeded(i + 2) * 1.55;
      const y = (seeded(i + 5) - 0.5) * 3.4;
      const z = Math.cos(angle * 0.78) * (1.1 + seeded(i + 7) * 1.4);
      nodes.push(new THREE.Vector3(Math.cos(angle) * radius, y, z));
    }

    const points = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      points[index * 3] = node.x;
      points[index * 3 + 1] = node.y;
      points[index * 3 + 2] = node.z;
    });

    const edges: number[] = [];
    nodes.forEach((node, index) => {
      for (let j = index + 1; j < nodes.length; j += 1) {
        const distance = node.distanceTo(nodes[j]);
        if (distance < 1.45 && edges.length < 780) {
          edges.push(node.x, node.y, node.z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    });

    return {
      nodePositions: points,
      linePositions: new Float32Array(edges)
    };
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = elapsed * 0.09;
      group.current.rotation.x = Math.sin(elapsed * 0.18) * 0.08;
    }
    if (core.current) {
      core.current.rotation.y = elapsed * 0.34;
      core.current.rotation.z = elapsed * 0.2;
      core.current.scale.setScalar(1 + Math.sin(elapsed * 1.15) * 0.035);
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#56e4ff" transparent opacity={0.34} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#d9fbff"
          size={0.052}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshBasicMaterial color="#56e4ff" wireframe transparent opacity={0.38} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

export function NeuralCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.4, 7.2], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#030407", 5.5, 11]} />
        <NeuralField />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_44%,transparent_0,rgba(3,4,7,.08)_36%,rgba(3,4,7,.72)_82%)]" />
      <div className="quiet-grid absolute inset-0 opacity-45" />
    </div>
  );
}
