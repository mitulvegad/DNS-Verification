"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--background)]">
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
                <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl relative z-10">
                    <div className="bg-primary p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                            <span className="text-primary text-xl font-black">CG</span>
                        </div>
                        <CardTitle className="text-2xl text-white font-bold tracking-tight">Create Account</CardTitle>
                        <CardDescription className="text-primary-foreground/80 mt-1">Join the multi-method verification platform</CardDescription>
                    </div>
                    <CardContent className="p-6 sm:p-8 space-y-5 bg-card">
                        {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm font-medium rounded-r-md">{error}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
                            <Input 
                                id="email"
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="admin@yourcompany.com"
                                className="h-12 px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Secure Password</Label>
                            <Input 
                                id="password"
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                className="h-12 px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="pt-4">
                            <Button 
                                className="w-full h-12 text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0" 
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Provisioning Workspace..." : "Create Secure Account"}
                            </Button>
                        </div>
                        <div className="text-center text-sm mt-6 text-slate-500">
                            Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in instead</Link>
                        </div>
                    </CardContent>
                </Card>
                <p className="mt-8 text-xs text-slate-400 font-medium">Bank-level encryption standards</p>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#00334E] to-[#145374] p-12 relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-1/4 right-10 animate-[bounce_7s_ease-in-out_infinite] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center gap-4 shadow-2xl">
                    <div className="bg-amber-400 p-3 rounded-lg text-xl">🔒</div>
                    <div>
                        <div className="font-bold text-lg">Bank-Level Security</div>
                        <div className="text-sm text-blue-100">End-to-end data encryption</div>
                    </div>
                </div>
                
                <div className="absolute bottom-1/3 left-10 animate-[bounce_6s_ease-in-out_infinite_reverse] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center gap-4 shadow-2xl">
                    <div className="bg-rose-400 p-3 rounded-lg text-xl">📊</div>
                    <div>
                        <div className="font-bold text-lg">Real-Time Dashboards</div>
                        <div className="text-sm text-blue-100">Monitor assets instantly</div>
                    </div>
                </div>
                
                <div className="relative z-10 max-w-lg mx-auto text-center mt-20">
                    <h2 className="text-4xl font-extrabold text-white mb-6">Start Protecting Today</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">Join thousands of developers using CyberGuard to ensure their infrastructure is locked down and immune to modern web vulnerabilities.</p>
                </div>
            </div>
        </div>
    );
}
