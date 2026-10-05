"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Shield, Lock, Key, ArrowRight } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setSuccessMsg("Account created successfully! Please login.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);
        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.access_token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-8 sm:p-10 relative z-10">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                </div>
            </div>
            
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                <p className="text-slate-500 mt-2 text-sm font-medium">Enter your credentials to access the secure portal</p>
            </div>

            {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3"><Shield className="w-4 h-4"/>{successMsg}</div>}
            {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3"><Lock className="w-4 h-4"/>{error}</div>}
            
            <div className="space-y-5">
                <div className="space-y-2 relative">
                    <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Email Address</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </div>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcompany.com" className="h-14 pl-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900" required />
                    </div>
                </div>
                
                <div className="space-y-2 relative">
                    <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Password</Label>
                        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Key className="w-5 h-5" />
                        </div>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="h-14 pl-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900" required />
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 mt-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2">
                {loading ? "Authenticating..." : "Sign In to Workspace"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
            
            <p className="text-center mt-8 text-sm font-medium text-slate-500">
                Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-2">Create one</Link>
            </p>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            {/* Left: Form Area */}
            <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-100">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
                <Suspense fallback={<div className="animate-pulse font-bold text-blue-600">Loading secure tunnel...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
            
            {/* Right: Feature Presentation */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-slate-950 p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                
                {/* Glowing Orbs */}
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse delay-1000"></div>
                
                <div className="relative z-10 w-full max-w-lg">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            CyberGuard V2 Architecture
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">The Modern Standard for Domain Security.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">Instantly verify infrastructure ownership using zero-downtime multi-method validation. Built for modern DevOps and cloud-native scaling.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="group bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors cursor-default flex items-center gap-4">
                            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-xl group-hover:scale-110 transition-transform"><Shield className="w-6 h-6"/></div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Bank-Level Encryption</h4>
                                <p className="text-slate-400 text-sm">Argon2id password hashing & AES-256 data protection</p>
                            </div>
                        </div>
                        <div className="group bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors cursor-default flex items-center gap-4">
                            <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">5-Method Verification</h4>
                                <p className="text-slate-400 text-sm">DNS TXT, CNAME, Meta Tag, HTTP File, and HTTP Header</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
