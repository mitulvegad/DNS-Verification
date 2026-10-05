"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, LayoutDashboard, Globe, Activity, ScanSearch, ShieldAlert, 
  Server, Lock, ShieldCheck, Mail, FileText, Clock, CreditCard, 
  Settings, Code, HelpCircle, Menu, Search as SearchIcon, Bell, 
  Sun, Moon, ChevronDown, CheckCircle2, ChevronRight, Check, X,
  AlertTriangle, ArrowRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";

// --- DATA ---
const chartData = [
  { name: 'Oct 18', Threats: 5, Scans: 20, Events: 10 },
  { name: 'Oct 19', Threats: 8, Scans: 25, Events: 15 },
  { name: 'Oct 20', Threats: 4, Scans: 18, Events: 8 },
  { name: 'Oct 21', Threats: 12, Scans: 35, Events: 20 },
  { name: 'Oct 22', Threats: 6, Scans: 22, Events: 12 },
  { name: 'Oct 23', Threats: 15, Scans: 45, Events: 25 },
  { name: 'Oct 24', Threats: 10, Scans: 30, Events: 18 },
];

type PlanType = 'Starter' | 'Pro' | 'Premium';

const starterFeatures = [
  { id: 'f1', title: 'Website Monitoring', desc: 'Monitor website availability and security status.' },
  { id: 'f2', title: 'Security Headers', desc: 'Check important HTTP security headers.' },
  { id: 'f3', title: 'DNS Security Monitoring', desc: 'A, AAAA, CNAME, MX, NS, TXT, CAA monitoring.' },
  { id: 'f4', title: 'Basic Threat Detection', desc: 'Detect suspicious activity and security events.' },
  { id: 'f5', title: 'SSL/TLS Monitoring', desc: 'Certificate validity and expiry monitoring.' },
  { id: 'f6', title: 'Security Reports', desc: 'Basic security reports.' },
];

const proFeatures = [
  { id: 'p1', title: 'Advanced Vulnerability Scanning', desc: 'Deeper website security checks.' },
  { id: 'p2', title: 'Cookies & Security Analysis', desc: 'Inspect security-sensitive cookies.' },
  { id: 'p3', title: 'Advanced Threat Detection', desc: 'More detailed malicious-activity detection.' },
  { id: 'p4', title: 'Technology Detection', desc: 'Detect technologies used by the website.' },
  { id: 'p5', title: 'Website Firewall', desc: 'Protect websites from malicious requests.' },
  { id: 'p6', title: 'Advanced Reports', desc: 'More detailed security findings and reports.' },
  { id: 'p7', title: 'Advanced DNS Change Detection', desc: 'Detect important DNS modifications.' },
  { id: 'p8', title: 'Real-Time Alerts', desc: 'Security alerts for important events.' },
];

const premiumFeatures = [
  { id: 'e1', title: 'Continuous Security Monitoring', desc: 'Continuous automated monitoring.' },
  { id: 'e2', title: 'Priority Threat Alerts', desc: 'Higher-priority security notifications.' },
  { id: 'e3', title: 'Advanced Exposure Monitoring', desc: 'Authorized external exposure checks.' },
  { id: 'e4', title: 'Advanced Security Reports', desc: 'Professional HTML/PDF reports.' },
  { id: 'e5', title: 'Deep Security Scanning', desc: 'Expanded security assessment.' },
  { id: 'e6', title: 'API Access', desc: 'Programmatic access to security data.' },
  { id: 'e7', title: 'Email Security Monitoring', desc: 'Email-domain security checks.' },
  { id: 'e8', title: 'Priority Support', desc: 'Priority assistance and support.' },
];

// --- COMPONENTS ---
function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
      
      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col lg:translate-x-0 transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white leading-tight">CyberGuard</h2>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Security Workspace</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
          
          <div>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg font-semibold text-sm">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
          </div>

          <div>
            <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wider">MAIN</p>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Globe className="w-4 h-4" /> Websites</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Activity className="w-4 h-4" /> Monitoring</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><ScanSearch className="w-4 h-4" /> Scanning</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><ShieldAlert className="w-4 h-4" /> Threats & Findings</Link>
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wider">SECURITY</p>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Server className="w-4 h-4" /> DNS Security</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Lock className="w-4 h-4" /> SSL/TLS</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><ShieldCheck className="w-4 h-4" /> Firewall</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><FileText className="w-4 h-4" /> Security Headers</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Mail className="w-4 h-4" /> Email Security</Link>
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wider">REPORTING</p>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><FileText className="w-4 h-4" /> Reports</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Clock className="w-4 h-4" /> Activity</Link>
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wider">ACCOUNT</p>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><CreditCard className="w-4 h-4" /> Subscription</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Settings className="w-4 h-4" /> Settings</Link>
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"><Code className="w-4 h-4" /> API</Link>
            </nav>
          </div>

        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 mb-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg font-medium text-sm transition-colors"><HelpCircle className="w-4 h-4" /> Help & Support</Link>
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-xs">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Admin</p>
              <p className="text-[10px] text-slate-500 truncate">admin@yourcompany.com</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<PlanType>('Starter');

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] lg:pl-64 flex flex-col font-sans transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* HEADER */}
      <header className="h-16 bg-white dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Menu className="w-5 h-5"/></button>
          <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
            CyberGuard <span className="mx-2 text-slate-300">/</span> <span className="text-slate-900 dark:text-white">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="relative hidden sm:block">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search anything..." className="h-9 pl-9 pr-8 w-64 bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder-slate-400" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm">⌘</span>
              <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm">K</span>
            </div>
          </div>
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </button>
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block"><HelpCircle className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:block">Admin</span>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto">
        
        {/* Welcome Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="mt-1"><Sun className="w-6 h-6 text-amber-500" /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good morning, Admin</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's the security status of your websites.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-4 h-4 text-blue-500" /> My Workspace <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-b-2xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20"><Globe className="w-6 h-6 text-blue-600 dark:text-blue-400"/></div>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Websites</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">3</h3>
              </div>
            </div>
            <div className="text-emerald-500 text-xs font-bold flex flex-col items-end"><span className="text-lg">↑</span> 1 new</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-b-2xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20"><ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400"/></div>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Threats Detected</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">12</h3>
              </div>
            </div>
            <div className="text-rose-500 text-xs font-bold flex flex-col items-end"><span className="text-lg">↑</span> 3</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-b-2xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20"><ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400"/></div>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Threats Blocked</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">9</h3>
              </div>
            </div>
            <div className="text-slate-500 text-xs font-bold flex flex-col items-end"><span className="text-lg">↑</span> 5</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400 rounded-b-2xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-[3px] border-emerald-100 dark:border-emerald-900 border-t-emerald-500 flex items-center justify-center rotate-45"><div className="-rotate-45 font-bold text-xs text-emerald-600 dark:text-emerald-400">94</div></div>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Security Score</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">94<span className="text-sm text-slate-400 font-medium">/100</span></h3>
              </div>
            </div>
            <div className="text-emerald-500 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Excellent</div>
          </motion.div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: SECURITY FEATURES & PLANS */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Security Features</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose a plan to see what's included and compare all features.</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center shadow-inner border border-slate-200 dark:border-slate-800">
                {(['Starter', 'Pro', 'Premium'] as PlanType[]).map(plan => (
                  <button 
                    key={plan}
                    onClick={() => setActivePlan(plan)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activePlan === plan ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Plan Card (Dynamic based on selected tab, for demo we follow prompt exactly: Starter selected shows Starter as Current Plan) */}
            <motion.div 
              key={activePlan}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-8 flex flex-col md:flex-row justify-between gap-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex-1 relative z-10">
                <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full mb-4 uppercase tracking-wider">Current Plan</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activePlan}</h3>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{activePlan === 'Starter' ? '₹799' : activePlan === 'Pro' ? '₹999' : '₹1499'}</span>
                  <span className="text-sm font-medium text-slate-500">/ month</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{activePlan === 'Starter' ? 'Basic protection for your website.' : activePlan === 'Pro' ? 'Advanced security and proactive monitoring.' : 'Enterprise-grade protection and APIs.'}</p>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-blue-600/20">Manage Plan</button>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800/50 relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Plan <span className="text-blue-600 dark:text-blue-400">Usage</span></h4>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">60%</span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">3 / 5 Websites</p>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                  <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-blue-600 rounded-full"></motion.div>
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800"><Clock className="w-4 h-4 text-slate-400"/></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Renewal</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">24 Oct 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Lists */}
            <div className="space-y-6">
              
              {/* STARTER FEATURES */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Starter Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  {starterFeatures.map(f => (
                    <div key={f.id} className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400"/></div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">Included</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRO FEATURES */}
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Shield className="w-6 h-6"/></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upgrade to Pro</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Get advanced security features and better protection for your website.</p>
                      {activePlan === 'Starter' && <button className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors shadow-sm">View Pro Features</button>}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-4 pl-0 sm:pl-6 sm:border-l border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">Pro Plan</p>
                      <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-slate-900 dark:text-white">₹999</span> <span className="text-xs text-slate-500">/ month</span></div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Most Popular</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {proFeatures.map(f => {
                    const isIncluded = activePlan === 'Pro' || activePlan === 'Premium';
                    return (
                    <div key={f.id} className="flex items-center gap-3">
                      {isIncluded ? 
                        <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400"/></div> : 
                        <Lock className="w-4 h-4 text-blue-400 shrink-0"/>
                      }
                      <h4 className={`text-xs font-semibold ${isIncluded ? 'text-slate-900 dark:text-white' : 'text-blue-600 dark:text-blue-400'}`}>{f.title}</h4>
                    </div>
                  )})}
                </div>
              </div>

              {/* PREMIUM FEATURES */}
              <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center"><ShieldCheck className="w-6 h-6"/></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise-Level Protection</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Maximum security with all advanced features and priority support.</p>
                      {activePlan !== 'Premium' && <button className="mt-3 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-full transition-colors shadow-sm">View Premium Features</button>}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-4 pl-0 sm:pl-6 sm:border-l border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-1">Premium Plan</p>
                      <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-slate-900 dark:text-white">₹1499</span> <span className="text-xs text-slate-500">/ month</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {premiumFeatures.map(f => {
                    const isIncluded = activePlan === 'Premium';
                    return (
                    <div key={f.id} className="flex items-center gap-3">
                      {isIncluded ? 
                        <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400"/></div> : 
                        <Lock className="w-4 h-4 text-purple-400 shrink-0"/>
                      }
                      <h4 className={`text-xs font-semibold ${isIncluded ? 'text-slate-900 dark:text-white' : 'text-purple-600 dark:text-purple-400'}`}>{f.title}</h4>
                    </div>
                  )})}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: WIDGETS */}
          <div className="space-y-6">
            
            {/* Monitored Websites */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Monitored Websites</h3>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors shadow-sm">+ Add Website</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="pb-3 font-semibold">Website</th>
                      <th className="pb-3 font-semibold">Score</th>
                      <th className="pb-3 font-semibold">SSL</th>
                      <th className="pb-3 font-semibold">DNS</th>
                      <th className="pb-3 font-semibold text-center">Threats</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Last Scan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">example.com</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">94</td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3 text-center font-semibold text-slate-900 dark:text-white">0</td>
                      <td className="py-3"><span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded text-[10px] font-bold">Protected</span></td>
                      <td className="py-3 text-right text-slate-500">2 min ago</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">myapp.com</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">87</td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3 text-center font-semibold text-slate-900 dark:text-white">2</td>
                      <td className="py-3"><span className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold">Warning</span></td>
                      <td className="py-3 text-right text-slate-500">18 min ago</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">testsite.net</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">72</td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3"><Check className="w-4 h-4 text-emerald-500"/></td>
                      <td className="py-3 text-center font-semibold text-slate-900 dark:text-white">1</td>
                      <td className="py-3"><span className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded text-[10px] font-bold">Critical</span></td>
                      <td className="py-3 text-right text-slate-500">1 hour ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Security Activity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Security Activity</h3>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</button>
              </div>
              
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-6 pb-2">
                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500"/></div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">SSL certificate verified</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">example.com</p>
                    </div>
                    <span className="text-[10px] text-slate-400">2 minutes ago</span>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 flex items-center justify-center"><Server className="w-3 h-3 text-blue-500"/></div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">DNS record change detected</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">myapp.com</p>
                    </div>
                    <span className="text-[10px] text-slate-400">12 minutes ago</span>
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-rose-500 flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-rose-500"/></div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Vulnerability found</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">testsite.net</p>
                    </div>
                    <span className="text-[10px] text-slate-400">25 minutes ago</span>
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center"><ShieldCheck className="w-3 h-3 text-emerald-500"/></div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Threat blocked</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">example.com</p>
                    </div>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500"/></div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Security scan completed</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">myapp.com</p>
                    </div>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Activity Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Security Activity</h3>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded cursor-pointer">7 Days</span>
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-1 cursor-pointer hover:text-slate-900 dark:hover:text-white">30 Days</span>
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-1 cursor-pointer hover:text-slate-900 dark:hover:text-white">90 Days</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-[10px] font-bold">
                <div className="flex items-center gap-1.5"><span className="w-2 h-1 bg-rose-500 rounded-full"></span> <span className="text-slate-600 dark:text-slate-400">Threats</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-1 bg-blue-500 rounded-full"></span> <span className="text-slate-600 dark:text-slate-400">Scans</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-1 bg-emerald-500 rounded-full"></span> <span className="text-slate-600 dark:text-slate-400">Security Events</span></div>
              </div>

              <div className="h-48 w-full mt-4">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} labelStyle={{ fontSize: '10px', color: '#64748b' }} />
                      <Line type="monotone" dataKey="Threats" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: '#f43f5e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Scans" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Events" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
