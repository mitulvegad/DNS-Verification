"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(email, password);
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 flex-row-reverse">
            
            {/* Right/Feature Area */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-slate-950 p-16 relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                
                {/* Glowing Orbs */}
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute top-1/4 -right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-700"></div>
                
                <div className="relative z-10 w-full max-w-lg">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                            <ShieldCheck className="w-4 h-4" /> Secure Provisioning
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">Protect Your Infrastructure.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">Join thousands of developers using CyberGuard to securely monitor and verify their digital assets across multiple hosting providers.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                            <div className="text-3xl font-black text-white mb-1">99.9%</div>
                            <div className="text-slate-400 text-sm font-medium">Uptime Guarantee</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                            <div className="text-3xl font-black text-white mb-1">&lt; 50ms</div>
                            <div className="text-slate-400 text-sm font-medium">Verification Latency</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md col-span-2 flex items-center justify-between">
                            <div className="text-slate-300 font-medium">Compatible with Cloudflare, Vercel, AWS, and 50+ providers.</div>
                            <div className="bg-white/10 p-2 rounded-lg"><ArrowRight className="w-5 h-5 text-emerald-400"/></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left/Form Area */}
            <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-slate-50 to-slate-100 order-2 lg:order-1">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
                
                <form onSubmit={handleRegister} className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-8 sm:p-10 relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/30">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">Deploy your dedicated security workspace</p>
                    </div>

                    {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3"><Lock className="w-4 h-4"/>{error}</div>}
                    
                    <div className="space-y-5">
                        <div className="space-y-2 relative">
                            <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Email Address</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcompany.com" className="h-14 pl-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-900" required />
                            </div>
                        </div>
                        
                        <div className="space-y-2 relative">
                            <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Master Password</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="h-14 pl-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-900" required />
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium ml-1 mt-1">Must be at least 8 characters long.</p>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-14 mt-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2">
                        {loading ? "Provisioning Workspace..." : "Initialize Workspace"}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                    
                    <p className="text-center mt-8 text-sm font-medium text-slate-500">
                        Already have an account? <Link href="/login" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-2">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
