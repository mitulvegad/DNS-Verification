"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addWebsite, getWebsites } from "@/lib/api";
import { Website } from "@/types/website";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [websites, setWebsites] = useState<Website[]>([]);
    const router = useRouter();

    const fetchWebsites = async () => {
        try {
            const data = await getWebsites();
            setWebsites(data);
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

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
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative">
                    <div className="absolute right-0 top-0 hidden md:flex gap-4 opacity-70">
                        <div className="animate-[bounce_4s_ease-in-out_infinite] bg-blue-100 p-3 rounded-2xl shadow-sm text-2xl">🔐</div>
                        <div className="animate-[bounce_5s_ease-in-out_infinite_reverse] bg-green-100 p-3 rounded-2xl shadow-sm text-2xl mt-4">🛰️</div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your digital assets and security perimeters.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Action Area */}
                    <div className="lg:col-span-2 space-y-8">
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Existing Domains List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800">Your Monitored Assets</h2>
                            {websites.length === 0 ? (
                                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
                                    No assets added yet. Add your first website above.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {websites.map(website => (
                                        <div key={website.website_id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                                    {website.normalized_hostname}
                                                    {website.status === "verified" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">🟢 Active</span>}
                                                    {website.status === "pending" && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">🟡 Pending</span>}
                                                    {(website.status === "failed" || website.status === "expired") && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">🔴 Deactivated</span>}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">Added: {new Date(website.expires_at).toLocaleDateString()}</p>
                                            </div>
                                            <Button 
                                                variant={website.status === "verified" ? "outline" : "default"}
                                                className={website.status === "verified" ? "border-slate-300" : "shadow-md"}
                                                onClick={() => router.push(`/websites/${website.website_id}/verify`)}
                                            >
                                                {website.status === "verified" ? "View Status" : "Complete Verification"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="hidden lg:block space-y-6">
                        <Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="text-primary text-xl group-hover:animate-bounce">🛡️</span> Bank-Level Security
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    CyberGuard uses multi-method verification to ensure that only authorized owners can initiate vulnerability scans against digital infrastructure.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="text-primary text-xl group-hover:animate-pulse">⚡</span> 5 Verification Methods
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
