import os
import re

base_frontend = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\frontend"

# --- 1. Login Page ---
login_code = """"use client";
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
"""

# --- 2. Register Page ---
register_code = """"use client";
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
"""

# --- 3. Dashboard Page - Inject Floating animations into Sidebar ---
with open(os.path.join(base_frontend, "app/dashboard/page.tsx"), "r", encoding="utf-8") as f:
    dashboard = f.read()

dashboard = dashboard.replace(
    '<Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm">',
    '<Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">'
)
dashboard = dashboard.replace(
    '<span className="text-primary text-xl">🛡️</span>',
    '<span className="text-primary text-xl group-hover:animate-bounce">🛡️</span>'
)
dashboard = dashboard.replace(
    '<span className="text-primary text-xl">⚡</span>',
    '<span className="text-primary text-xl group-hover:animate-pulse">⚡</span>'
)

# Add a floating background element to the dashboard header
dashboard = dashboard.replace(
    '<div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">',
    """<div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative">
                    <div className="absolute right-0 top-0 hidden md:flex gap-4 opacity-70">
                        <div className="animate-[bounce_4s_ease-in-out_infinite] bg-blue-100 p-3 rounded-2xl shadow-sm text-2xl">🔐</div>
                        <div className="animate-[bounce_5s_ease-in-out_infinite_reverse] bg-green-100 p-3 rounded-2xl shadow-sm text-2xl mt-4">🛰️</div>
                    </div>"""
)


# --- 4. Verify Page - Add Info icons and tooltips ---
with open(os.path.join(base_frontend, "app/websites/[id]/verify/page.tsx"), "r", encoding="utf-8") as f:
    verify = f.read()

# Shared Info SVG
info_svg = """<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>"""

# TXT replacement
txt_orig = """<div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🌐</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Add a TXT Record</h3>
                                                        <p className="text-sm text-slate-500">Log into your domain registrar and add this DNS record.</p>
                                                    </div>
                                                </div>"""
txt_new = f"""<div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🌐</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Add a TXT Record</h3>
                                                            <p className="text-sm text-slate-500">Log into your domain registrar and add this DNS record.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2">{info_svg}</div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to add a TXT record:</p>
                                                            <ol className="list-decimal pl-4 space-y-1">
                                                                <li>Log into your DNS provider (e.g. GoDaddy).</li>
                                                                <li>Navigate to DNS Management.</li>
                                                                <li>Add a new record and select "TXT".</li>
                                                                <li>Paste the Name and Value below.</li>
                                                                <li>Save and wait 1-5 minutes for propagation.</li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </div>"""
verify = verify.replace(txt_orig, txt_new)

# CNAME replacement
cname_orig = """<div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🔗</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Add a CNAME Record</h3>
                                                        <p className="text-sm text-slate-500">Route a subdomain to our verification server.</p>
                                                    </div>
                                                </div>"""
cname_new = f"""<div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🔗</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Add a CNAME Record</h3>
                                                            <p className="text-sm text-slate-500">Route a subdomain to our verification server.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2">{info_svg}</div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to add a CNAME:</p>
                                                            <ol className="list-decimal pl-4 space-y-1">
                                                                <li>Go to your DNS provider's dashboard.</li>
                                                                <li>Create a new DNS record.</li>
                                                                <li>Select "CNAME" as the type.</li>
                                                                <li>Enter "_cyberguard" as the Name.</li>
                                                                <li>Paste the Target exactly as shown below.</li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </div>"""
verify = verify.replace(cname_orig, cname_new)

# HTTP File replacement
http_orig = """<div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">📄</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Upload Verification File</h3>
                                                        <p className="text-sm text-slate-500">Create a file on your server (e.g. in your public/static folder).</p>
                                                    </div>
                                                </div>"""
http_new = f"""<div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">📄</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Upload Verification File</h3>
                                                            <p className="text-sm text-slate-500">Create a file on your server (e.g. in your public/static folder).</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2">{info_svg}</div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to use HTTP File:</p>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                <li>In your website's root public folder, create a directory named <code>.well-known</code>.</li>
                                                                <li>Inside it, create a file named <code>cyberguard-verification.txt</code>.</li>
                                                                <li>Paste the Content string inside the file.</li>
                                                                <li>Ensure the file is publicly accessible over HTTP/HTTPS.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>"""
verify = verify.replace(http_orig, http_new)

# Meta Tag replacement
meta_orig = """<div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🏷️</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Insert Meta Tag</h3>
                                                        <p className="text-sm text-slate-500">Add this HTML tag into the <code className="bg-slate-200 px-1 rounded">&lt;head&gt;</code> of your homepage.</p>
                                                    </div>
                                                </div>"""
meta_new = f"""<div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🏷️</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Insert Meta Tag</h3>
                                                            <p className="text-sm text-slate-500">Add this HTML tag into the <code className="bg-slate-200 px-1 rounded">&lt;head&gt;</code> of your homepage.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2">{info_svg}</div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to insert a Meta Tag:</p>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                <li>Open the HTML source of your homepage (index.html, header.php, etc.).</li>
                                                                <li>Locate the <code>&lt;head&gt;</code> section.</li>
                                                                <li>Paste the meta tag right before the closing <code>&lt;/head&gt;</code> tag.</li>
                                                                <li>Publish your changes and click Verify.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>"""
verify = verify.replace(meta_orig, meta_new)

# HTTP Header replacement
header_orig = """<div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">⚙️</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">Inject HTTP Header <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded uppercase font-bold">Advanced</span></h3>
                                                        <p className="text-sm text-slate-500">Configure your server to return this HTTP response header.</p>
                                                    </div>
                                                </div>"""
header_new = f"""<div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">⚙️</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">Inject HTTP Header <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded uppercase font-bold">Advanced</span></h3>
                                                            <p className="text-sm text-slate-500">Configure your server to return this HTTP response header.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2">{info_svg}</div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to inject an HTTP Header:</p>
                                                            <p className="mb-2">This is for advanced users managing Nginx, Apache, or edge workers (Cloudflare Workers/Vercel Middleware).</p>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                <li>Add a configuration rule to inject the custom header into the response of your root path <code>/</code>.</li>
                                                                <li>Set the Header Name and Value exactly as shown.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>"""
verify = verify.replace(header_orig, header_new)

# Save files
with open(os.path.join(base_frontend, "app/login/page.tsx"), "w", encoding="utf-8") as f:
    f.write(login_code)
with open(os.path.join(base_frontend, "app/register/page.tsx"), "w", encoding="utf-8") as f:
    f.write(register_code)
with open(os.path.join(base_frontend, "app/dashboard/page.tsx"), "w", encoding="utf-8") as f:
    f.write(dashboard)
with open(os.path.join(base_frontend, "app/websites/[id]/verify/page.tsx"), "w", encoding="utf-8") as f:
    f.write(verify)

print("Floating UI features applied successfully!")
