import os
import textwrap

base = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\frontend"

dirs = [
    "app/login",
    "app/dashboard",
    "app/websites/[id]/verify",
    "components",
    "lib",
    "types"
]

for d in dirs:
    os.makedirs(os.path.join(base, d), exist_ok=True)

files = {
    "types/website.ts": textwrap.dedent("""\
    export interface VerificationInstructions {
        type: string;
        name: string;
        value: string;
    }

    export interface Website {
        website_id: number;
        domain: string;
        verification: VerificationInstructions;
        status: string;
        expires_at: string;
    }

    export interface VerifyResponse {
        verified: boolean;
        status: string;
        domain: string;
        message?: string;
    }
    """),

    "lib/api.ts": textwrap.dedent("""\
    const API_URL = "http://localhost:8000";

    function getAuthHeader() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    export async function login(email: string, password: string) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Login failed");
        }
        return res.json();
    }

    export async function register(email: string, password: string) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Registration failed");
        }
        return res.json();
    }

    export async function addWebsite(url: string) {
        const res = await fetch(`${API_URL}/websites/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify({ url }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to add website");
        }
        return res.json();
    }

    export async function getWebsite(id: string) {
        const res = await fetch(`${API_URL}/websites/${id}`, {
            method: "GET",
            headers: getAuthHeader(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to get website");
        }
        return res.json();
    }

    export async function verifyWebsite(id: string) {
        const res = await fetch(`${API_URL}/websites/${id}/verify`, {
            method: "POST",
            headers: getAuthHeader(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to verify website");
        }
        return res.json();
    }
    """),

    "app/login/page.tsx": textwrap.dedent("""\
    "use client";
    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { login, register } from "@/lib/api";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";

    export default function LoginPage() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState("");
        const router = useRouter();

        const handleAction = async (action: "login" | "register") => {
            setError("");
            try {
                const data = action === "login" 
                    ? await login(email, password)
                    : await register(email, password);
                localStorage.setItem("token", data.access_token);
                router.push("/dashboard");
            } catch (err: any) {
                setError(err.message);
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md bg-card shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-[var(--foreground)] font-bold">CyberGuard</CardTitle>
                        <CardDescription>Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password"
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleAction("login")}>Login</Button>
                            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="outline" onClick={() => handleAction("register")}>Register</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    """),

    "app/dashboard/page.tsx": textwrap.dedent("""\
    "use client";
    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { addWebsite } from "@/lib/api";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>
                        <Button variant="outline" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>Logout</Button>
                    </div>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-[var(--foreground)]">Add Website</CardTitle>
                            <CardDescription>Enter your website URL to begin verification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL</Label>
                                <Input 
                                    id="url"
                                    placeholder="https://www.example.com" 
                                    value={url} 
                                    onChange={e => setUrl(e.target.value)} 
                                />
                            </div>
                            <Button 
                                className="bg-primary hover:bg-primary/90 text-white" 
                                onClick={handleAdd} 
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Continue"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    """),

    "components/dns-instructions.tsx": textwrap.dedent("""\
    import { Website } from "@/types/website";
    import { Button } from "@/components/ui/button";
    import { useState } from "react";

    export function DnsInstructions({ website, onVerify, verifying }: { website: Website, onVerify: () => void, verifying: boolean }) {
        const [copiedName, setCopiedName] = useState(false);
        const [copiedValue, setCopiedValue] = useState(false);

        const copyText = (text: string, setter: (val: boolean) => void) => {
            navigator.clipboard.writeText(text);
            setter(true);
            setTimeout(() => setter(false), 2000);
        };

        return (
            <div className="space-y-6">
                <p className="text-[var(--foreground)] font-medium">
                    Add this TXT record to your DNS provider:
                </p>
                
                <div className="bg-muted p-4 rounded-md border space-y-4">
                    <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-1">Type</div>
                        <div className="font-mono bg-card px-3 py-2 rounded border">{website.verification.type}</div>
                    </div>
                    
                    <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-1">Name</div>
                        <div className="flex items-center gap-2">
                            <div className="font-mono bg-card px-3 py-2 rounded border flex-1 overflow-auto">
                                {website.verification.name}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyText(website.verification.name, setCopiedName)}>
                                {copiedName ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-1">Value</div>
                        <div className="flex items-center gap-2">
                            <div className="font-mono bg-card px-3 py-2 rounded border flex-1 overflow-auto break-all">
                                {website.verification.value}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyText(website.verification.value, setCopiedValue)}>
                                {copiedValue ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-[var(--foreground)] space-y-1">
                    <p>1. Open your DNS provider</p>
                    <p>2. Create the TXT record</p>
                    <p>3. Save it</p>
                    <p>4. Return here</p>
                    <p>5. Click Verify Domain</p>
                </div>

                <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white mt-4 py-6 text-lg" 
                    onClick={onVerify}
                    disabled={verifying}
                >
                    {verifying ? "Checking DNS..." : "Verify Domain"}
                </Button>
            </div>
        );
    }
    """),

    "app/websites/[id]/verify/page.tsx": textwrap.dedent("""\
    "use client";
    import { useEffect, useState } from "react";
    import { useParams, useRouter } from "next/navigation";
    import { getWebsite, verifyWebsite } from "@/lib/api";
    import { Website } from "@/types/website";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { DnsInstructions } from "@/components/dns-instructions";
    import { Button } from "@/components/ui/button";

    export default function VerifyPage() {
        const { id } = useParams();
        const router = useRouter();
        const [website, setWebsite] = useState<Website | null>(null);
        const [error, setError] = useState("");
        const [verifying, setVerifying] = useState(false);
        const [message, setMessage] = useState("");

        useEffect(() => {
            if (id) {
                getWebsite(id as string).then(setWebsite).catch(err => {
                    setError(err.message);
                });
            }
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
                    if (res.message?.includes("not match")) {
                        setError("We found the TXT record, but its value does not match the value CyberGuard provided. Please copy the value again and update your DNS record.");
                    } else {
                        setError("We could not find the TXT record yet. Please check your DNS provider and try again.");
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setVerifying(false);
            }
        };

        if (!website) return <div className="p-8 text-center">Loading...</div>;

        return (
            <div className="min-h-screen bg-background p-8 flex items-start justify-center pt-20">
                <Card className="w-full max-w-xl shadow-lg border-border">
                    <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
                        <CardTitle className="text-2xl">Verify {website.domain}</CardTitle>
                        <CardDescription className="text-secondary-foreground/80">
                            Prove you own this domain to enable security scans.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {website.status === "verified" ? (
                            <div className="text-center space-y-6 py-8">
                                <div className="text-5xl">🟢</div>
                                <h2 className="text-2xl font-bold text-[var(--foreground)]">Domain Verified</h2>
                                <p className="text-[var(--foreground)]">{website.domain}</p>
                                <Button className="bg-secondary text-white hover:bg-secondary/90 w-full max-w-sm mt-4">
                                    Start Security Scan
                                </Button>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}
                                <DnsInstructions 
                                    website={website} 
                                    onVerify={handleVerify} 
                                    verifying={verifying} 
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }
    """),

    "app/page.tsx": textwrap.dedent("""\
    import { redirect } from 'next/navigation';

    export default function Home() {
        redirect('/login');
    }
    """)
}

for path, content in files.items():
    with open(os.path.join(base, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend files generated successfully!")
