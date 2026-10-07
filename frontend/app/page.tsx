"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ShieldVisual } from "@/components/3d/ShieldVisual";
import { EarthVisual } from "@/components/3d/EarthVisual";
import { Shield, ShieldAlert, Search, ShieldCheck, Activity, Lock, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-slate-50"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-semibold mb-8">
                <Shield className="w-4 h-4" /> Website Security, Simplified.
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Complete Security <br className="hidden md:block"/>for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-400">Website</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
                Monitor, protect and secure your website with advanced security features. Get real-time threat detection, vulnerability scanning, DNS monitoring and more — all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/register" className="h-14 px-8 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 group">
                  Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="h-14 px-8 flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold text-lg transition-colors">
                  <Activity className="w-5 h-5 text-slate-400" /> Explore Features
                </a>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500"/> No credit card required</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500"/> Setup in minutes</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500"/> 24/7 Monitoring</div>
              </div>
            </motion.div>

            {/* Right 3D Visual */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <ShieldVisual />
            </motion.div>
            
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white dark:bg-[#060c1a] border-y border-slate-100 dark:border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Security That Covers Every Layer</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to monitor, detect and protect your website from modern cyber threats.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>, title: "DNS Security Monitoring", desc: "Track A, AAAA, CNAME, MX, NS, TXT and CAA records and detect important DNS changes." },
                { icon: <ShieldAlert className="w-6 h-6" />, title: "Malicious Activity Detection", desc: "Get alerts for suspicious traffic and unusual behavior." },
                { icon: <Search className="w-6 h-6" />, title: "Vulnerability Scanning", desc: "Find and fix security weaknesses before attackers do." },
                { icon: <ShieldCheck className="w-6 h-6" />, title: "Website Firewall", desc: "Block threats and filter malicious requests." },
                { icon: <Lock className="w-6 h-6" />, title: "SSL/TLS Monitoring", desc: "Ensure your certificates are valid and secure." },
                { icon: <Activity className="w-6 h-6" />, title: "Detailed Reports", desc: "Get clear insights with easy-to-understand security reports." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-8 rounded-3xl hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY SHOWCASE & EARTH */}
        <section className="py-24 bg-slate-950 relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4">Why CyberGuard?</div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Proactive Security for a <br/><span className="text-cyan-400">Safer Tomorrow.</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
                  CyberGuard gives you the tools to stay ahead of cyber threats. From DNS monitoring to real-time alerts, everything you need to keep your website and data safe — in one place.
                </p>
                <div className="space-y-4">
                  {['All-in-one security dashboard', 'Real-time threat alerts', 'Easy setup & management', 'Built for developers, businesses & agencies'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center"><Check className="w-3 h-3 text-cyan-400"/></div>
                      <span className="font-semibold text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                 <EarthVisual />
              </motion.div>
            </div>

            {/* Statistics Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
               <div className="text-center md:text-left flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><ShieldCheck className="w-8 h-8 text-cyan-400"/></div>
                  <div>
                    <div className="text-3xl font-black text-white">99.9%</div>
                    <div className="text-slate-400 text-sm font-semibold">Uptime Guarantee</div>
                  </div>
               </div>
               <div className="hidden md:block w-px h-16 bg-white/10"></div>
               <div className="text-center md:text-left flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><Activity className="w-8 h-8 text-cyan-400"/></div>
                  <div>
                    <div className="text-3xl font-black text-white">&lt; 50ms</div>
                    <div className="text-slate-400 text-sm font-semibold">Threat Detection Speed</div>
                  </div>
               </div>
               <div className="hidden md:block w-px h-16 bg-white/10"></div>
               <div className="text-center md:text-left flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">24/7</div>
                    <div className="text-slate-400 text-sm font-semibold">Monitoring & Support</div>
                  </div>
               </div>
               <div className="hidden md:block w-px h-16 bg-white/10"></div>
               <div className="text-center md:text-left flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><Search className="w-8 h-8 text-cyan-400"/></div>
                  <div>
                    <div className="text-3xl font-black text-white">100+</div>
                    <div className="text-slate-400 text-sm font-semibold">Websites Protected</div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section id="pricing" className="py-24 bg-slate-50 dark:bg-[#020617] border-y border-slate-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Security Plans That Scale With You</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {[
                { name: "Starter", price: "₹799", desc: "Essential security for small sites.", rec: false },
                { name: "Pro", price: "₹999", desc: "Advanced protection & DNS monitoring.", rec: true },
                { name: "Premium", price: "₹1499", desc: "Enterprise-grade SOC and support.", rec: false }
              ].map((plan, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`bg-white dark:bg-slate-900 border ${plan.rec ? 'border-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-105 z-10' : 'border-slate-200 dark:border-white/10'} rounded-3xl p-8 relative`}
                >
                  {plan.rec && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Recommended</div>}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{plan.desc}</p>
                  <div className="mb-6"><span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span> <span className="text-slate-500 font-medium">/ month</span></div>
                  <ul className="space-y-4 mb-8">
                    {[1,2,3,4].map(j => (
                      <li key={j} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Check className={`w-4 h-4 ${plan.rec ? 'text-cyan-500' : 'text-blue-500'}`} /> Feature {j} included
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className={`block text-center w-full py-3 rounded-xl font-bold transition-all ${plan.rec ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white'}`}>
                    Choose {plan.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white dark:bg-[#060c1a] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-96 bg-blue-500/10 blur-[100px] rounded-full"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Secure Your Website <br/>Before Attackers Find It.</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Start monitoring and protecting your website with CyberGuard.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 h-16 px-10 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 group">
              Start Securing My Website <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="about" className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 group mb-2">
                <Shield className="w-6 h-6 text-cyan-500" />
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CyberGuard</span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Website security, monitoring and protection.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-cyan-500 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-cyan-500 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-cyan-500 transition-colors">About</a>
              <a href="#" className="hover:text-cyan-500 transition-colors">Contact</a>
              <a href="#" className="hover:text-cyan-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-500 transition-colors">Terms</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <p>© 2026 CyberGuard. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
