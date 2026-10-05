"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Extrude, Float, Environment, ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Lock, Shield, CheckCircle, Activity, Search, ShieldAlert } from "lucide-react";

function ShieldGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom shield shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.5);
    s.bezierCurveTo(1.5, 1.5, 1.5, 0.5, 1.5, 0);
    s.bezierCurveTo(1.5, -1, 0, -2.5, 0, -2.5);
    s.bezierCurveTo(0, -2.5, -1.5, -1, -1.5, 0);
    s.bezierCurveTo(-1.5, 0.5, -1.5, 1.5, 0, 1.5);
    return s;
  }, []);

  const extrudeSettings = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={0.5} 
          chromaticAberration={0.5} 
          anisotropy={0.3} 
          distortion={0.5} 
          distortionScale={0.5} 
          temporalDistortion={0.1} 
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Inner glowing lock representation */}
      <mesh position={[0, -0.2, 0.3]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      
      {/* Orbiting rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 100;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#38bdf8" />
    </instancedMesh>
  );
}

export function ShieldVisual() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#10b981" intensity={1} />
          <ShieldGeometry />
          <Particles />
          <Environment preset="city" />
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        </Canvas>
      </div>

      {/* HTML Floating Cards */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Dashboard Mockup Behind Shield */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[320px] bg-[#0B1221]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden hidden md:block -z-10 mt-10 ml-20"
        >
          <div className="flex h-full">
            <div className="w-32 border-r border-white/5 p-4 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-6"><Shield className="w-4 h-4 text-blue-400"/> CyberGuard</div>
              <div className="h-8 bg-white/10 rounded flex items-center px-2 text-xs text-blue-300 font-medium"><Activity className="w-3 h-3 mr-2"/> Dashboard</div>
              <div className="h-8 rounded flex items-center px-2 text-xs text-slate-400"><Search className="w-3 h-3 mr-2"/> Scanning</div>
              <div className="h-8 rounded flex items-center px-2 text-xs text-slate-400"><ShieldAlert className="w-3 h-3 mr-2"/> Reports</div>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg"><CheckCircle className="w-6 h-6 text-emerald-400"/></div>
                <div>
                  <h4 className="text-white font-semibold">Website Protected</h4>
                  <p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> No threats detected</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-slate-400 text-[10px] uppercase">Sites Monitored</p>
                  <p className="text-white font-bold text-xl">3</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-slate-400 text-[10px] uppercase">Threats Blocked</p>
                  <p className="text-white font-bold text-xl">0</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-slate-400 text-[10px] uppercase">Uptime</p>
                  <p className="text-white font-bold text-xl">99.9%</p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase mb-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Real-time Monitoring</p>
                <div className="h-12 w-full flex items-end gap-1 opacity-50">
                  {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/20 to-emerald-400/50 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Badges */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-[15%] right-[10%] bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><Search className="w-4 h-4 text-blue-400"/></div>
          <span className="text-white text-sm font-semibold">Web Scanning</span>
        </motion.div>

        <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute bottom-[25%] left-[5%] bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          </div>
          <span className="text-white text-sm font-semibold">DNS Monitoring</span>
        </motion.div>

        <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }} className="absolute top-[60%] right-[5%] bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-rose-400"/></div>
          <span className="text-white text-sm font-semibold">Firewall Protection</span>
        </motion.div>

      </div>
    </div>
  );
}
