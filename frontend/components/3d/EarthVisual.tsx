"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";

function Globe() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) earthRef.current.rotation.y += 0.002;
    if (atmosRef.current) atmosRef.current.rotation.y += 0.0025;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial color="#020617" emissive="#0f172a" specular="#38bdf8" shininess={100} wireframe={true} wireframeLinewidth={0.5} transparent opacity={0.6} />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh ref={atmosRef} scale={1.1}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Nodes */}
      {Array.from({ length: 30 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 30);
        const theta = Math.sqrt(30 * Math.PI) * phi;
        const r = 2.02;
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        );
      })}
    </group>
  );
}

export function EarthVisual() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 -ml-20">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} color="#38bdf8" intensity={1} />
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
            <Globe />
          </Float>
        </Canvas>
      </div>

      {/* HTML Notifications */}
      <div className="absolute inset-0 z-20 pointer-events-none flex justify-center items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[20%] left-[10%] md:left-[20%] bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-start gap-4 shadow-2xl max-w-[280px]"
        >
          <div className="bg-rose-500/20 p-2 rounded-lg mt-1"><ShieldAlert className="w-5 h-5 text-rose-500" /></div>
          <div>
            <h4 className="text-white font-bold text-sm">Threat Blocked</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">Suspicious IP blocked from accessing your website</p>
            <p className="text-slate-500 text-[10px] mt-2 font-medium">2 minutes ago</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-[20%] left-[10%] md:left-[15%] bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-start gap-4 shadow-2xl max-w-[280px]"
        >
          <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
             <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">DNS Record Changed</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">CNAME record updated successfully.</p>
            <p className="text-slate-500 text-[10px] mt-2 font-medium">12 minutes ago</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute top-[50%] right-[10%] md:right-[20%] bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-start gap-4 shadow-2xl max-w-[280px]"
        >
          <div className="bg-emerald-500/20 p-2 rounded-lg mt-1"><Lock className="w-5 h-5 text-emerald-500" /></div>
          <div>
            <h4 className="text-white font-bold text-sm">SSL Certificate</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">Certificate is valid and secure.</p>
            <p className="text-slate-500 text-[10px] mt-2 font-medium">1 hour ago</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
