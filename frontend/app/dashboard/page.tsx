"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addWebsite, getWebsites } from "@/lib/api";
import { WebsiteResponse } from "@/types/website";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, LogOut, CheckCircle2, Clock, XCircle, ChevronRight, Activity, Server, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [url, setUrl] = useState("");
    const [websites, setWebsites] = useState<WebsiteResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const data = await getWebsites();
                setWebsites(data);
            } catch (err) {
                console.error("Failed to fetch websites", err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchWebsites();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await addWebsite(url);
            // If the backend returns an existing website, it just safely routes us there!
            router.push(`/websites/${data.website_id}/verify`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const verifiedCount = websites.filter(w => w.status === "verified").length;
    const pendingCount = websites.filter(w => w.status === "pending").length;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Premium Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">CyberGuard <span className="text-blue-600">V2</span></h1>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Server className="w-6 h-6"/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Assets</p>
                            <h3 className="text-3xl font-black text-slate-900">{websites.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6"/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Verified</p>
                            <h3 className="text-3xl font-black text-slate-900">{verifiedCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6"/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
                            <h3 className="text-3xl font-black text-slate-900">{pendingCount}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Add Asset Section */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Protect a new asset</h2>
                            <p className="text-slate-500 font-medium mb-8">Enter a root domain or subdomain to instantly begin multi-method security monitoring.</p>
                            
                            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 relative z-10">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <Input 
                                        type="url" 
                                        value={url} 
                                        onChange={e => setUrl(e.target.value)} 
                                        placeholder="https://example.com" 
                                        className="h-14 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-lg font-medium shadow-inner"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 shrink-0">
                                    <Plus className="w-5 h-5"/>
                                    {loading ? "Initializing..." : "Add Asset"}
                                </Button>
                            </form>
                            {error && <p className="mt-4 text-rose-600 font-semibold flex items-center gap-2"><XCircle className="w-4 h-4"/> {error}</p>}
                        </div>

                        {/* List Area */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Activity className="w-5 h-5 text-slate-400"/> Monitored Infrastructure</h3>
                            </div>
                            
                            {fetchLoading ? (
                                <div className="space-y-4">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : websites.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-3xl">
                                    <Server className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-slate-700">No assets monitored yet</h4>
                                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">Add your first domain above to secure your infrastructure.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {websites.map(web => (
                                        <Link href={`/websites/${web.website_id}/verify`} key={web.website_id} className="block group">
                                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                                                
                                                {/* Status left border glow */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                                    web.status === 'verified' ? 'bg-emerald-500' : 
                                                    web.status === 'pending' ? 'bg-amber-400' : 'bg-rose-500'
                                                }`}></div>

                                                <div className="pl-3">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{web.normalized_hostname}</h4>
                                                        <a href={web.original_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600" onClick={e => e.stopPropagation()}><ExternalLink className="w-4 h-4"/></a>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-medium font-mono">{web.registrable_domain}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    {web.status === "verified" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                                                            <CheckCircle2 className="w-4 h-4" /> Active
                                                        </span>
                                                    )}
                                                    {web.status === "pending" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200">
                                                            <Clock className="w-4 h-4" /> Pending Action
                                                        </span>
                                                    )}
                                                    {web.status === "failed" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-bold border border-rose-200">
                                                            <XCircle className="w-4 h-4" /> Deactivated
                                                        </span>
                                                    )}
                                                    
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                            <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400"/> Security Center</h3>
                            
                            <ul className="space-y-5 relative z-10">
                                <li className="flex gap-4">
                                    <div className="mt-0.5 bg-white/10 p-2 rounded-lg shrink-0"><Server className="w-4 h-4 text-blue-300"/></div>
                                    <div>
                                        <p className="font-bold text-slate-100">Multi-Node Scanning</p>
                                        <p className="text-sm text-slate-400 mt-1">Distributed verification from global edge locations.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-0.5 bg-white/10 p-2 rounded-lg shrink-0"><CheckCircle2 className="w-4 h-4 text-emerald-300"/></div>
                                    <div>
                                        <p className="font-bold text-slate-100">Instant Issue Issuance</p>
                                        <p className="text-sm text-slate-400 mt-1">Zero wait time for domain challenges and TTLs.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
