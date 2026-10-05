import os

base = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\frontend"

globals_css = """@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

:root {
  /* PREMIUM TRUST BLUE PALETTE */
  --background: #F4F7FB; /* Very soft blue-gray background */
  --foreground: #0B1B28; /* Deep navy text for maximum readability */
  
  --card: #FFFFFF;
  --card-foreground: #0B1B28;
  
  --primary: #0052CC; /* Premium Atlassian/Stripe style Trust Blue */
  --primary-foreground: #FFFFFF;
  
  --secondary: #E1EFFE; /* Light blue for secondary actions */
  --secondary-foreground: #1E429F; /* Dark blue text on secondary */
  
  --muted: #F1F5F9;
  --muted-foreground: #64748B;
  
  --accent: #DBEAFE;
  --accent-foreground: #1E3A8A;
  
  --border: #E2E8F0;
  --input: #E2E8F0;
  --ring: #0052CC;
  
  --radius: 0.75rem; /* Smoother, modern corners */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
  html {
    @apply font-sans;
  }
}
"""

login_page = """"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl">
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <Suspense fallback={<div className="text-primary font-bold animate-pulse">Loading secure environment...</div>}>
                <LoginForm />
            </Suspense>
            <p className="mt-8 text-xs text-slate-400 font-medium">Protected by AES-256 & Argon2id</p>
        </div>
    );
}
"""

register_page = """"use client";
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl">
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
    );
}
"""

dashboard_page = """"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addWebsite } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAdd = async () => {
        setError("");
        setLoading(true);
        try {
            const data = await addWebsite(url);
            router.push(`/websites/${data.website_id}/verify`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Premium Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs font-black">CG</span>
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">CyberGuard</span>
                    </div>
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-medium" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage your digital assets and security perimeters.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Action Area */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg border-slate-200/60 rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8 sm:px-8 text-white">
                                <CardTitle className="text-2xl mb-2 text-white">Protect a new asset</CardTitle>
                                <CardDescription className="text-blue-100 text-base">Enter the URL of your website or application to establish ownership and begin continuous monitoring.</CardDescription>
                            </div>
                            <CardContent className="p-6 sm:p-8 bg-white space-y-6">
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-medium rounded-r-md">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <Label htmlFor="url" className="text-base font-semibold text-slate-800">Asset URL</Label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Input 
                                            id="url"
                                            placeholder="https://www.yourdomain.com" 
                                            value={url} 
                                            onChange={e => setUrl(e.target.value)}
                                            className="h-12 px-4 text-base bg-slate-50 border-slate-200 focus:bg-white flex-1 transition-all"
                                        />
                                        <Button 
                                            className="h-12 px-8 text-base font-semibold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto" 
                                            onClick={handleAdd} 
                                            disabled={loading}
                                        >
                                            {loading ? "Provisioning..." : "Add Asset →"}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-500">Supports custom domains, Vercel, Netlify, and Cloudflare targets.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="hidden lg:block space-y-6">
                        <Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="text-primary text-xl">🛡️</span> Bank-Level Security
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    CyberGuard uses multi-method verification to ensure that only authorized owners can initiate vulnerability scans against digital infrastructure.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="text-primary text-xl">⚡</span> 5 Verification Methods
                                </h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>✓ DNS TXT Records</li>
                                    <li>✓ Hosted Website Files</li>
                                    <li>✓ HTML Meta Tags</li>
                                    <li>✓ HTTP Response Headers</li>
                                    <li>✓ DNS CNAME Routing</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
"""

verify_page = """"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWebsite, verifyWebsite, changeVerificationMethod, rotateVerificationToken } from "@/lib/api";
import { Website } from "@/types/website";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [website, setWebsite] = useState<Website | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [rotating, setRotating] = useState(false);

    const fetchWebsite = async () => {
        try {
            const data = await getWebsite(id as string);
            setWebsite(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (id) fetchWebsite();
    }, [id]);

    const handleVerify = async () => {
        setVerifying(true);
        setError("");
        setMessage("");
        try {
            const res = await verifyWebsite(id as string);
            if (res.verified) {
                setWebsite(prev => prev ? { ...prev, status: "verified" } : null);
            } else {
                setError(res.message || "Verification failed");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    const handleMethodChange = async (method: string) => {
        try {
            await changeVerificationMethod(id as string, method);
            await fetchWebsite();
        } catch(err: any) {
            setError(err.message);
        }
    };

    const handleRotate = async () => {
        setRotating(true);
        try {
            await rotateVerificationToken(id as string);
            await fetchWebsite();
        } catch(err: any) {
            setError(err.message);
        } finally {
            setRotating(false);
        }
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (!website) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading secure environment...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Premium Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs font-black">CG</span>
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight hidden sm:inline-block">CyberGuard</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="font-medium text-slate-600">
                        ← Dashboard
                    </Button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col gap-6">
                    
                    <Card className="w-full shadow-xl border-slate-200/60 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900">Verify Ownership</CardTitle>
                                    <CardDescription className="text-base text-slate-500 mt-1">
                                        Establish control over <strong className="text-slate-800">{website.normalized_hostname}</strong>
                                    </CardDescription>
                                </div>
                                <div>
                                    {website.status === "verified" ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
                                            ⧗ Pending Verification
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6 sm:p-8 bg-slate-50/50">
                            {website.status === "verified" ? (
                                <div className="text-center space-y-6 py-12">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <span className="text-5xl">🛡️</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-slate-900">Domain Authorized</h2>
                                        <p className="text-slate-500 mt-2 max-w-md mx-auto">Your ownership of <strong className="text-slate-800">{website.normalized_hostname}</strong> has been mathematically proven and recorded.</p>
                                    </div>
                                    <Button className="h-12 px-8 text-base font-bold shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all bg-green-600 hover:bg-green-700 text-white">
                                        Initiate Security Scan →
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-slate-700 font-medium mb-4">
                                            Select an authentication method supported by your infrastructure:
                                        </p>
                                        
                                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                                            <Button size="sm" className="rounded-full shadow-sm" variant={website.verification_method === "dns_txt" ? "default" : "outline"} onClick={() => handleMethodChange("dns_txt")}>
                                                🌐 DNS TXT {website.recommended_method === "dns_txt" && "★"}
                                            </Button>
                                            <Button size="sm" className="rounded-full shadow-sm" variant={website.verification_method === "dns_cname" ? "default" : "outline"} onClick={() => handleMethodChange("dns_cname")}>
                                                🌐 DNS CNAME
                                            </Button>
                                            <Button size="sm" className="rounded-full shadow-sm" variant={website.verification_method === "http_file" ? "default" : "outline"} onClick={() => handleMethodChange("http_file")}>
                                                📄 File {website.recommended_method === "http_file" && "★"}
                                            </Button>
                                            <Button size="sm" className="rounded-full shadow-sm" variant={website.verification_method === "meta_tag" ? "default" : "outline"} onClick={() => handleMethodChange("meta_tag")}>
                                                🏷 Meta Tag
                                            </Button>
                                            <Button size="sm" className="rounded-full shadow-sm" variant={website.verification_method === "http_header" ? "default" : "outline"} onClick={() => handleMethodChange("http_header")}>
                                                ⚙ Header
                                            </Button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-medium rounded-r-md shadow-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                                        {website.verification_method === "dns_txt" && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🌐</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Add a TXT Record</h3>
                                                        <p className="text-sm text-slate-500">Log into your domain registrar and add this DNS record.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Type</span> 
                                                        <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 text-slate-800 font-bold shadow-sm">TXT</span> 
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Name</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.name}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.name)}>Copy</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Value</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.value}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.value)}>Copy</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {website.verification_method === "dns_cname" && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🔗</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Add a CNAME Record</h3>
                                                        <p className="text-sm text-slate-500">Route a subdomain to our verification server.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Type</span> 
                                                        <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 text-slate-800 font-bold shadow-sm">CNAME</span> 
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Name</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.name}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.name)}>Copy</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Target</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.cname_target}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.cname_target || "")}>Copy</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {website.verification_method === "http_file" && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">📄</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Upload Verification File</h3>
                                                        <p className="text-sm text-slate-500">Create a file on your server (e.g. in your public/static folder).</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Path</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.url_path}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.url_path || "")}>Copy</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-20">Content</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.value}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.value)}>Copy</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {website.verification_method === "meta_tag" && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🏷️</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">Insert Meta Tag</h3>
                                                        <p className="text-sm text-slate-500">Add this HTML tag into the <code className="bg-slate-200 px-1 rounded">&lt;head&gt;</code> of your homepage.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                                                    <div className="font-mono bg-slate-800 text-green-400 p-4 rounded-md text-sm sm:text-base overflow-x-auto shadow-inner whitespace-pre">
                                                        {website.verification.meta_tag}
                                                    </div>
                                                    <Button variant="secondary" size="sm" className="mt-3 w-full sm:w-auto" onClick={() => copyText(website.verification.meta_tag || "")}>Copy Meta Tag</Button>
                                                </div>
                                            </>
                                        )}
                                        {website.verification_method === "http_header" && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">⚙️</span></div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">Inject HTTP Header <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded uppercase font-bold">Advanced</span></h3>
                                                        <p className="text-sm text-slate-500">Configure your server to return this HTTP response header.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-24">Header</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.header_name}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.header_name || "")}>Copy</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <span className="font-semibold text-slate-600 text-sm w-24">Value</span> 
                                                        <div className="flex-1 flex gap-2">
                                                            <span className="font-mono bg-white border px-3 py-1.5 rounded text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap shadow-sm">{website.verification.value}</span> 
                                                            <Button variant="secondary" size="sm" onClick={() => copyText(website.verification.value)}>Copy</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 items-center border-t border-slate-200 pt-6">
                                        <Button 
                                            className="w-full sm:w-auto h-14 bg-primary hover:bg-blue-700 text-white text-lg font-bold px-10 shadow-lg hover:-translate-y-0.5 transition-all" 
                                            onClick={handleVerify}
                                            disabled={verifying}
                                        >
                                            {verifying ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                                                    Authenticating...
                                                </span>
                                            ) : "Verify Configuration"}
                                        </Button>
                                        <Button variant="ghost" className="w-full sm:w-auto text-slate-500 hover:text-slate-900" onClick={handleRotate} disabled={rotating}>
                                            Rotate Security Token
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
"""

with open(os.path.join(base, "app/globals.css"), "w", encoding="utf-8") as f:
    f.write(globals_css)

with open(os.path.join(base, "app/login/page.tsx"), "w", encoding="utf-8") as f:
    f.write(login_page)

with open(os.path.join(base, "app/register/page.tsx"), "w", encoding="utf-8") as f:
    f.write(register_page)

with open(os.path.join(base, "app/dashboard/page.tsx"), "w", encoding="utf-8") as f:
    f.write(dashboard_page)

with open(os.path.join(base, "app/websites/[id]/verify/page.tsx"), "w", encoding="utf-8") as f:
    f.write(verify_page)

print("Premium UI successfully applied to all pages!")
