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
                                                <div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🌐</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Add a TXT Record</h3>
                                                            <p className="text-sm text-slate-500">Log into your domain registrar and add this DNS record.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
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
                                                <div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🔗</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Add a CNAME Record</h3>
                                                            <p className="text-sm text-slate-500">Route a subdomain to our verification server.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
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
                                                <div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">📄</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Upload Verification File</h3>
                                                            <p className="text-sm text-slate-500">Create a file on your server (e.g. in your public/static folder).</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
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
                                                <div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">🏷️</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">Insert Meta Tag</h3>
                                                            <p className="text-sm text-slate-500">Add this HTML tag into the <code className="bg-slate-200 px-1 rounded">&lt;head&gt;</code> of your homepage.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
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
                                                <div className="flex items-start justify-between gap-3 relative z-20">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-lg"><span className="text-primary text-xl">⚙️</span></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">Inject HTTP Header <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded uppercase font-bold">Advanced</span></h3>
                                                            <p className="text-sm text-slate-500">Configure your server to return this HTTP response header.</p>
                                                        </div>
                                                    </div>
                                                    <div className="group relative cursor-pointer">
                                                        <div className="text-slate-400 hover:text-primary transition-colors p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs p-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                                            <p className="font-bold text-sm mb-2 text-blue-200">How to inject an HTTP Header:</p>
                                                            <p className="mb-2">This is for advanced users managing Nginx, Apache, or edge workers (Cloudflare Workers/Vercel Middleware).</p>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                <li>Add a configuration rule to inject the custom header into the response of your root path <code>/</code>.</li>
                                                                <li>Set the Header Name and Value exactly as shown.</li>
                                                            </ul>
                                                        </div>
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
