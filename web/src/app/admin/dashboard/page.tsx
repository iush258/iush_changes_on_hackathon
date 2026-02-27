"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, FileCode, CheckCircle, CreditCard, Activity, Shield, BarChart3, Database, Download, ShieldAlert, QrCode, Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Team = {
    id: string;
    name: string;
    memberCount: number;
    registrationApproved: boolean;
    paymentVerified: boolean;
    psStatus: string;
    repoUrl: string | null;
    avgScore: number | null;
};

const IST_OFFSET_MINUTES = 5 * 60 + 30;

// Payment Configuration Panel Component
function PaymentConfigPanel() {
    const [paymentConfig, setPaymentConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [qrPreview, setQrPreview] = useState<string | null>(null);

    const fetchPaymentConfig = async () => {
        try {
            const res = await fetch("/api/admin/payment-config", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setPaymentConfig(data);
                setQrPreview(data.qrCodeUrl);
            }
        } catch (err) {
            console.error("Failed to fetch payment config:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentConfig();

        // poll statistics so the dashboard reflects live numbers when
        // payments are approved. previously the panel only fetched once
        // which made the counter appear frozen.
        const interval = setInterval(fetchPaymentConfig, 10000);
        return () => clearInterval(interval);
    }, []);

    const updatePaymentMode = async (mode: "QR" | "DISABLED") => {
        setSaving(true);
        setError("");
        setSuccess("");
        
        try {
            const res = await fetch("/api/admin/payment-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentMode: mode }),
            });
            
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to update payment mode");
                return;
            }
            
            setSuccess(`Payment mode updated to ${mode === "QR" ? "QR Code" : "Disabled"}`);
            fetchPaymentConfig();
        } catch (err) {
            setError("Failed to update payment mode");
        } finally {
            setSaving(false);
        }
    };

    const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setQrPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("qrCode", file);

        try {
            const res = await fetch("/api/admin/payment-config", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to upload QR code");
                return;
            }

            const data = await res.json();
            setSuccess("QR code uploaded successfully");
            setQrPreview(data.qrCodeUrl);
        } catch (err) {
            setError("Failed to upload QR code");
        } finally {
            setUploading(false);
        }
    };

    const removeQrCode = async () => {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/payment-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrCodeUrl: null }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to remove QR code");
                return;
            }

            setSuccess("QR code removed");
            setQrPreview(null);
            fetchPaymentConfig();
        } catch (err) {
            setError("Failed to remove QR code");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card className="border-primary/30 bg-primary/[0.04]">
                <CardContent className="py-8 text-center text-muted-foreground">
                    Loading payment configuration...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/30 bg-primary/[0.04]">
            <CardHeader>
                <CardTitle className="font-mono uppercase text-xs tracking-wider text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                        {success}
                    </div>
                )}

                {/* Payment Mode Toggle */}
                <div className="space-y-2">
                    <Label className="text-xs font-mono uppercase text-muted-foreground">Payment Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={paymentConfig?.paymentMode === "QR" ? "default" : "outline"}
                            className={paymentConfig?.paymentMode === "QR" ? "bg-primary text-primary-foreground" : ""}
                            onClick={() => updatePaymentMode("QR")}
                            disabled={saving}
                        >
                            <QrCode className="w-4 h-4 mr-2" />
                            QR Code Payment
                        </Button>
                        <Button
                            variant={paymentConfig?.paymentMode === "DISABLED" ? "default" : "outline"}
                            className={paymentConfig?.paymentMode === "DISABLED" ? "bg-destructive text-destructive-foreground" : ""}
                            onClick={() => updatePaymentMode("DISABLED")}
                            disabled={saving}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Disable Payment
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        {paymentConfig?.paymentMode === "QR" 
                            ? "Users must enter transaction ID during registration" 
                            : "Payment collection is disabled - no payment required"}
                    </p>
                </div>

                {/* QR Code Upload - Only show in QR mode */}
                {paymentConfig?.paymentMode === "QR" && (
                    <div className="space-y-2">
                        <Label className="text-xs font-mono uppercase text-muted-foreground">QR Code Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden">
                                {qrPreview ? (
                                    <Image 
                                        src={qrPreview} 
                                        alt="QR Code" 
                                        width={96} 
                                        height={96} 
                                        className="object-contain"
                                    />
                                ) : (
                                    <QrCode className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleQrUpload}
                                    disabled={uploading}
                                    className="text-xs"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Upload QR code for UPI payment. Max 5MB.
                                </p>
                            </div>
                            {qrPreview && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={removeQrCode}
                                    disabled={saving}
                                    className="text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Live Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-border">
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground font-mono">Early Bird</p>
                        <p className="text-lg font-bold text-green-500 font-mono">
                            {paymentConfig?.earlyBirdCount || 0}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                            {paymentConfig?.earlyBirdSlotsRemaining || 0} slots left
                        </p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground font-mono">Regular</p>
                        <p className="text-lg font-bold text-blue-500 font-mono">
                            {paymentConfig?.regularCount || 0}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                            {paymentConfig?.regularSlotsRemaining || 0} slots left
                        </p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground font-mono">Admin</p>
                        <p className="text-lg font-bold text-purple-500 font-mono">
                            {paymentConfig?.adminAddedCount || 0}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                            {paymentConfig?.adminSlotsRemaining || 0} slots left
                        </p>
                    </div>
                    <div className="bg-muted/30 border border-border rounded p-2 text-center">
                        <p className="text-[10px] text-muted-foreground font-mono">Online Verified</p>
                        <p className="text-lg font-bold text-foreground font-mono">
                            {paymentConfig?.onlineVerifiedCount || 0}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                            {paymentConfig?.onlineSpotsRemaining || 0} spots left
                        </p>
                    </div>
                </div>

                {/* Fee Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                    <p><span className="font-mono">Early Bird Fee:</span> ₹{paymentConfig?.earlyBirdFee || 110}/member</p>
                    <p><span className="font-mono">Regular Fee:</span> ₹{paymentConfig?.regularFee || 150}/member</p>
                    <p><span className="font-mono">Online Limit:</span> {paymentConfig?.onlineTeamLimit || 80} teams</p>
                    <p><span className="font-mono">Total Limit:</span> {paymentConfig?.totalTeamLimit || 100} teams</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboardPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [configLoading, setConfigLoading] = useState(false);
    const [configSaving, setConfigSaving] = useState(false);
    const [configError, setConfigError] = useState("");
    const [configSuccess, setConfigSuccess] = useState("");
    const [eventMode, setEventMode] = useState<"TESTING" | "LIVE">("LIVE");

    const fetchEventConfig = async () => {
        setConfigLoading(true);
        setConfigError("");
        try {
            const res = await fetch("/api/admin/hackathon-config", { cache: "no-store" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setConfigError(data.error || "Failed to load event config");
                return;
            }
            setEventMode(data.mode === "TESTING" ? "TESTING" : "LIVE");
        } catch {
            setConfigError("Failed to load event config");
        } finally {
            setConfigLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchTeams = () => {
            setLoadError("");
            fetch("/api/admin/teams", { cache: "no-store" })
                .then(async (r) => {
                    const body = await r.json().catch(() => ({}));
                    if (!r.ok) throw new Error(body?.error || `Failed to load teams (HTTP ${r.status})`);
                    return body;
                })
                .then((data) => setTeams(Array.isArray(data) ? data : []))
                .catch((err: unknown) => {
                    setTeams([]);
                    setLoadError(err instanceof Error ? err.message : "Failed to load teams");
                })
                .finally(() => setLoading(false));
        };

        fetchTeams();
        const interval = setInterval(fetchTeams, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch("/api/auth/session")
            .then((r) => (r.ok ? r.json() : null))
            .then((session) => {
                const superAdmin = session?.user?.role === "SUPERADMIN";
                setIsSuperAdmin(superAdmin);
                if (superAdmin) {
                    fetchEventConfig();
                }
            })
            .catch(() => setIsSuperAdmin(false));
    }, []);

    const saveEventConfig = async (mode: "TESTING" | "LIVE") => {
        setConfigSaving(true);
        setConfigError("");
        setConfigSuccess("");

        const now = new Date();
        const payload: any = { mode };

        if (mode === "TESTING") {
            // Standard 30m test spec
            payload.testingHomepageCountdownTargetAt = now.toISOString();
            payload.problemSelectionStartAt = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
            payload.hackathonEndAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
        }

        try {
            const res = await fetch("/api/admin/hackathon-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setConfigError(data.error || "Failed to save event config");
                return;
            }
            setConfigSuccess(`Switched to ${mode} mode successfully.`);
            setEventMode(data.mode === "TESTING" ? "TESTING" : "LIVE");
        } catch {
            setConfigError("Failed to save event config");
        } finally {
            setConfigSaving(false);
        }
    };

    const totalTeams = teams.length;
    const totalMembers = teams.reduce((s, t) => s + t.memberCount, 0);
    const approvedTeams = teams.filter(t => t.registrationApproved).length;
    const paidTeams = teams.filter(t => t.paymentVerified).length;
    const lockedTeams = teams.filter(t => t.psStatus === "LOCKED").length;
    const repoLinked = teams.filter(t => !!t.repoUrl).length;
    const scoredTeams = teams.filter(t => t.avgScore !== null).length;
    const averageTotalScore = scoredTeams > 0
        ? Math.round(teams.filter(t => t.avgScore !== null).reduce((sum, t) => sum + (t.avgScore ?? 0), 0) / scoredTeams)
        : 0;

    const stats = [
        { icon: Users, label: "Total Teams", value: totalTeams, color: "text-primary" },
        { icon: Users, label: "Participants", value: totalMembers, color: "text-blue-400" },
        { icon: Shield, label: "Approved", value: `${approvedTeams} / ${totalTeams}`, color: "text-neon-green" },
        { icon: CreditCard, label: "Payment Verified", value: `${paidTeams} / ${totalTeams}`, color: "text-neon-green" },
        { icon: FileCode, label: "PS Locked", value: lockedTeams, color: "text-yellow-500" },
        { icon: Activity, label: "Repo Linked", value: repoLinked, color: "text-blue-400" },
        { icon: BarChart3, label: "Scored", value: scoredTeams, color: "text-purple-400" },
        { icon: BarChart3, label: "Avg Total Score", value: `${averageTotalScore} / 100`, color: "text-primary" },
        { icon: CheckCircle, label: "Pending Approvals", value: totalTeams - approvedTeams, color: totalTeams - approvedTeams > 0 ? "text-destructive" : "text-neon-green" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-foreground">
                    Admin <span className="text-primary">Dashboard</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Real-time hackathon overview</p>
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">Loading...</div>
            ) : loadError ? (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                    {loadError}
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Card className="border-border bg-card/50">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <Card className="border-border bg-card/50">
                        <CardHeader>
                            <CardTitle className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <Link
                                    href="/admin/teams"
                                    className="block p-4 rounded-lg border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/[0.04] transition-all text-center"
                                >
                                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-sm font-bold text-foreground">Manage Teams</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Approve, verify payments, delete</p>
                                </Link>
                                <Link
                                    href="/admin/problems"
                                    className="block p-4 rounded-lg border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/[0.04] transition-all text-center"
                                >
                                    <FileCode className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-sm font-bold text-foreground">Problem Statements</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Add, remove, manage</p>
                                </Link>
                                <div className="p-4 rounded-lg border border-border bg-muted/20 text-center">
                                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm font-bold text-foreground">Scoring</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{scoredTeams} teams scored so far</p>
                                </div>
                                <Link
                                    href="/admin/admins"
                                    className="block p-4 rounded-lg border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/[0.04] transition-all text-center"
                                >
                                    <ShieldAlert className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-sm font-bold text-foreground">Manage Admins</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Superadmin-only admin controls</p>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {isSuperAdmin && (
                        <>
                            <Card className="border-primary/30 bg-primary/[0.04]">
                                <CardHeader>
                                    <CardTitle className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Superadmin Event Control</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {configError && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                                            {configError}
                                        </div>
                                    )}
                                    {configSuccess && (
                                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                                            {configSuccess}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <Button
                                            variant={eventMode === "LIVE" ? "default" : "outline"}
                                            className={eventMode === "LIVE" ? "bg-primary text-primary-foreground" : ""}
                                            onClick={() => saveEventConfig("LIVE")}
                                            disabled={configLoading || configSaving}
                                        >
                                            Live Published Mode
                                        </Button>
                                        <Button
                                            variant={eventMode === "TESTING" ? "default" : "outline"}
                                            className={eventMode === "TESTING" ? "bg-primary text-primary-foreground" : ""}
                                            onClick={() => saveEventConfig("TESTING")}
                                            disabled={configLoading || configSaving}
                                        >
                                            Testing Mode (30m System)
                                        </Button>
                                        <Button variant="outline" onClick={fetchEventConfig} disabled={configLoading || configSaving}>
                                            {configLoading ? "Loading..." : "Reload Config"}
                                        </Button>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Testing Mode automatically sets a 30-minute total timer with problem selection starting after 5 minutes, and commit validation every 6 minutes.
                                    </p>
                                </CardContent>
                            </Card>

                            <PaymentConfigPanel />
                        </>
                    )}

                    {/* Database Export */}
                    <Card className="border-border bg-card/50">
                        <CardHeader>
                            <CardTitle className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Database Export</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-border bg-muted/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Download All Tables</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Exports Teams, Users, Problem Statements, Scores, and Notifications in Excel format.
                                        </p>
                                    </div>
                                </div>
                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                    <a href="/api/admin/export">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Excel
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Teams */}
                    <Card className="border-border bg-card/50">
                        <CardHeader>
                            <CardTitle className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Recent Registrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {teams.slice(0, 5).map(team => (
                                    <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold font-mono text-xs">
                                                {team.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{team.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{team.memberCount} members</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${team.registrationApproved ? "bg-neon-green/10 text-neon-green" : "bg-yellow-500/10 text-yellow-500"}`}>
                                                {team.registrationApproved ? "Approved" : "Pending"}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${team.paymentVerified ? "bg-neon-green/10 text-neon-green" : "bg-yellow-500/10 text-yellow-500"}`}>
                                                {team.paymentVerified ? "Paid" : "Unpaid"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {teams.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-6">No teams registered yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
