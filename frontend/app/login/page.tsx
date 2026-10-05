"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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

    const handleLogin = async () => {
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
        <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl relative z-10">
            <div className="bg-primary p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <span className="text-primary text-xl font-black">CG</span>
                </div>
                <CardTitle className="text-2xl text-white font-bold tracking-tight">CyberGuard V2</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-1">Enterprise-grade security monitoring</CardDescription>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-5 bg-card">
                {successMsg && <div className="bg-green-50 border-l-4 border-green-500 p-3 text-green-700 text-sm font-medium rounded-r-md">{successMsg}</div>}
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
                    <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
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
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </Button>
                </div>
                <div className="text-center text-sm mt-6 text-slate-500">
                    New to CyberGuard? <Link href="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--background)]">
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
                <Suspense fallback={<div className="text-primary font-bold animate-pulse">Loading secure environment...</div>}>
                    <LoginForm />
                </Suspense>
                <p className="mt-8 text-xs text-slate-400 font-medium">Protected by AES-256 & Argon2id</p>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#00334E] to-[#145374] p-12 relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-10 animate-[bounce_6s_ease-in-out_infinite] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center gap-4 shadow-2xl">
                    <div className="bg-green-400 p-3 rounded-lg text-xl">🛡️</div>
                    <div>
                        <div className="font-bold text-lg">Continuous Scanning</div>
                        <div className="text-sm text-blue-100">24/7 vulnerability detection</div>
                    </div>
                </div>
                
                <div className="absolute bottom-1/3 right-10 animate-[bounce_8s_ease-in-out_infinite_reverse] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center gap-4 shadow-2xl">
                    <div className="bg-blue-400 p-3 rounded-lg text-xl">🌐</div>
                    <div>
                        <div className="font-bold text-lg">Multi-Method Auth</div>
                        <div className="text-sm text-blue-100">DNS, HTML, and HTTP</div>
                    </div>
                </div>

                <div className="absolute top-2/3 left-1/4 animate-[pulse_5s_ease-in-out_infinite] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center gap-4 shadow-2xl transform scale-90">
                    <div className="bg-purple-400 p-3 rounded-lg text-xl">⚡</div>
                    <div>
                        <div className="font-bold text-lg">Zero Downtime</div>
                        <div className="text-sm text-blue-100">Silent infrastructure analysis</div>
                    </div>
                </div>
                
                <div className="relative z-10 max-w-lg mx-auto text-center mt-20">
                    <h2 className="text-4xl font-extrabold text-white mb-6">Enterprise Web Security</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">CyberGuard monitors your digital assets using state-of-the-art verification methods. Prove ownership safely and securely without exposing your infrastructure.</p>
                </div>
            </div>
        </div>
    );
}
