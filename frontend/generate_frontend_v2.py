import os
import textwrap

base = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\frontend"

files = {
    "types/website.ts": textwrap.dedent("""\
    export interface VerificationInstructions {
        type: string;
        name: string;
        value: string;
        method: string;
        url_path?: string;
        meta_tag?: string;
        header_name?: string;
    }

    export interface Website {
        website_id: number;
        original_url: string;
        normalized_hostname: string;
        registrable_domain: string;
        verification: VerificationInstructions;
        status: string;
        verification_method: string;
        recommended_method: string;
        available_methods: string[];
        expires_at: string;
    }

    export interface VerifyResponse {
        verified: boolean;
        status: string;
        method: string;
        message?: string;
    }
    """),

    "lib/api.ts": textwrap.dedent("""\
    const API_URL = "http://localhost:8000/api"; // Updated to use the /api prefix you configured earlier

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
        const res = await fetch(`${API_URL}/websites/${id}/verification/verify`, {
            method: "POST",
            headers: getAuthHeader(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to verify website");
        }
        return res.json();
    }

    export async function changeVerificationMethod(id: string, method: string) {
        const res = await fetch(`${API_URL}/websites/${id}/verification/method`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify({ method }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to change method");
        }
        return res.json();
    }

    export async function rotateVerificationToken(id: string) {
        const res = await fetch(`${API_URL}/websites/${id}/verification/rotate`, {
            method: "POST",
            headers: getAuthHeader(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to rotate token");
        }
        return res.json();
    }
    """),

    "app/websites/[id]/verify/page.tsx": textwrap.dedent("""\
    "use client";
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
            alert("Copied to clipboard!");
        };

        if (!website) return <div className="p-8 text-center">Loading...</div>;

        return (
            <div className="min-h-screen bg-background p-8 flex items-start justify-center pt-20">
                <div className="w-full max-w-3xl flex flex-col gap-4">
                    <div>
                        <Button variant="outline" onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:text-foreground">
                            ← Back to Dashboard
                        </Button>
                    </div>

                    <Card className="w-full shadow-lg border-border">
                        <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
                            <CardTitle className="text-2xl">Verify Your Website</CardTitle>
                            <CardDescription className="text-secondary-foreground/80">
                                {website.normalized_hostname}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {website.status === "verified" ? (
                                <div className="text-center space-y-6 py-8">
                                    <div className="text-5xl">🟢</div>
                                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Domain Verified</h2>
                                    <p className="text-[var(--foreground)]">{website.normalized_hostname}</p>
                                    <Button className="bg-secondary text-white hover:bg-secondary/90 w-full max-w-sm mt-4">
                                        Start Security Scan
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-[var(--foreground)] font-medium">
                                        We need to verify that you control this website before security scanning is enabled.
                                    </p>
                                    
                                    <div className="flex gap-2 flex-wrap">
                                        <Button variant={website.verification_method === "dns_txt" ? "default" : "outline"} onClick={() => handleMethodChange("dns_txt")}>
                                            🌐 DNS TXT {website.recommended_method === "dns_txt" && "(Recommended)"}
                                        </Button>
                                        <Button variant={website.verification_method === "http_file" ? "default" : "outline"} onClick={() => handleMethodChange("http_file")}>
                                            📄 Website File {website.recommended_method === "http_file" && "(Recommended)"}
                                        </Button>
                                        <Button variant={website.verification_method === "meta_tag" ? "default" : "outline"} onClick={() => handleMethodChange("meta_tag")}>
                                            🏷 HTML Meta Tag
                                        </Button>
                                        <Button variant={website.verification_method === "http_header" ? "default" : "outline"} onClick={() => handleMethodChange("http_header")}>
                                            ⚙ HTTP Header (Advanced)
                                        </Button>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="bg-muted p-4 rounded-md border space-y-4">
                                        {website.verification_method === "dns_txt" && (
                                            <>
                                                <p className="text-sm font-semibold">Add this TXT record to your DNS provider:</p>
                                                <div><span className="font-semibold text-xs">Type:</span> <span className="font-mono bg-card px-2 py-1 rounded">TXT</span></div>
                                                <div><span className="font-semibold text-xs">Name:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.name}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.name)}>Copy</Button></div>
                                                <div><span className="font-semibold text-xs">Value:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.value}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.value)}>Copy</Button></div>
                                            </>
                                        )}
                                        {website.verification_method === "http_file" && (
                                            <>
                                                <p className="text-sm font-semibold">Create this file on your server (e.g. in your public folder):</p>
                                                <div><span className="font-semibold text-xs">Path:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.url_path}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.url_path || "")}>Copy</Button></div>
                                                <div><span className="font-semibold text-xs">Content:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.value}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.value)}>Copy</Button></div>
                                                <p className="text-xs mt-2 text-muted-foreground">This file must be accessible at: https://{website.normalized_hostname}{website.verification.url_path}</p>
                                            </>
                                        )}
                                        {website.verification_method === "meta_tag" && (
                                            <>
                                                <p className="text-sm font-semibold">Add this meta tag inside your website's &lt;head&gt;:</p>
                                                <div className="font-mono bg-card px-3 py-2 rounded text-sm overflow-auto">
                                                    {website.verification.meta_tag}
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-2" onClick={() => copyText(website.verification.meta_tag || "")}>Copy Meta Tag</Button>
                                            </>
                                        )}
                                        {website.verification_method === "http_header" && (
                                            <>
                                                <p className="text-sm font-semibold text-amber-600">Advanced / Developer Method</p>
                                                <p className="text-sm">Configure your server to return this HTTP response header:</p>
                                                <div><span className="font-semibold text-xs">Header Name:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.header_name}</span></div>
                                                <div><span className="font-semibold text-xs">Header Value:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.value}</span></div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <Button 
                                            className="bg-primary hover:bg-primary/90 text-white py-6 text-lg px-8" 
                                            onClick={handleVerify}
                                            disabled={verifying}
                                        >
                                            {verifying ? "Checking..." : "Verify Website"}
                                        </Button>
                                        <Button variant="ghost" onClick={handleRotate} disabled={rotating}>
                                            Generate New Token
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    """)
}

for path, content in files.items():
    with open(os.path.join(base, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend V2 files generated successfully!")
