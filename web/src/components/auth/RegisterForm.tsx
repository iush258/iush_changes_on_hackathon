"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, CheckCircle, CreditCard, QrCode, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { CountdownTimer } from "@/components/registration/CountdownTimer";
import Image from "next/image";

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState<{ teamId: string; message: string } | null>(null);
    const [teamName, setTeamName] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [teamLeaderName, setTeamLeaderName] = useState("");
    const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
    const [teamLeaderPhone, setTeamLeaderPhone] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [members, setMembers] = useState([
        { name: "", email: "" },
        { name: "", email: "" },
    ]);
    const router = useRouter();

    // Payment configuration state
    const [paymentConfig, setPaymentConfig] = useState<{
        paymentMode: string;
        qrCodeUrl: string | null;
        paymentEnabled: boolean;
        earlyBirdLimit: number;
        earlyBirdFee: number;
        regularFee: number;
        onlineTeamLimit: number;
        totalTeamLimit: number;
        onlineVerifiedCount: number;
        earlyBirdCount: number;
        regularCount: number;
        adminAddedCount: number;
        earlyBirdSlotsRemaining: number;
        regularSlotsRemaining: number;
        onlineSpotsRemaining: number;
        totalSpotsRemaining: number;
        currentTier: string | null;
        currentFeePerMember: number | null;
        onlineRegistrationOpen: boolean;
    } | null>(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [configError, setConfigError] = useState<string | null>(null);

    // Fetch payment config on mount
    useEffect(() => {
        const fetchPaymentConfig = async () => {
            try {
                const res = await fetch("/api/payment/config", { 
                    cache: "no-store",
                    headers: { "Cache-Control": "no-store" }
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Payment config fetched:", data); // Debug log
                    setPaymentConfig(data);
                    setConfigError(null);
                } else {
                    console.error("Failed to fetch payment config:", res.status, res.statusText);
                    setConfigError(`Server error: ${res.status}`);
                }
            } catch (err) {
                console.error("Failed to fetch payment config:", err);
                setConfigError("Failed to connect to server");
            } finally {
                setConfigLoading(false);
            }
        };

        fetchPaymentConfig();
        
        // Poll for live updates every 10 seconds
        const interval = setInterval(fetchPaymentConfig, 10000);
        return () => clearInterval(interval);
    }, []);

    // Calculate total members (leader + additional members)
    const totalMembers = members.length + 1; // 1 leader + additional members

    // Max 4 total members including team leader, so max 3 additional members
    const MAX_ADDITIONAL_MEMBERS = 3;
    const canAddMember = members.length < MAX_ADDITIONAL_MEMBERS;
    const canRemoveMember = members.length > 1; // At least 1 additional member

    const addMember = () => {
        if (canAddMember) {
            setMembers([...members, { name: "", email: "" }]);
        }
    };

    const removeMember = (index: number) => {
        if (canRemoveMember) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const updateMember = (index: number, field: "name" | "email", value: string) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    teamName, 
                    collegeName, 
                    teamLeaderName, 
                    teamLeaderEmail, 
                    teamLeaderPhone, 
                    transactionId,
                    members 
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch (parseErr) {
                console.error("Failed to parse response:", parseErr, "Status:", res.status);
                setError(`Server error (HTTP ${res.status}): Invalid response. Please check if the server is running.`);
                setIsLoading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || `Registration failed (HTTP ${res.status})`);
                setIsLoading(false);
                return;
            }

            setSuccess({ teamId: data.team.id, message: data.message });
            setIsLoading(false);
        } catch (err) {
            console.error("Registration error:", err);
            const errorMessage = err instanceof Error ? err.message : "Network error";
            setError(`Network error: ${errorMessage}. Please check your connection and ensure the server is running.`);
            setIsLoading(false);
        }
    }

    if (success) {
        return (
            <Card className="border-border bg-card/80 backdrop-blur-md w-full max-w-lg mx-auto">
                <CardContent className="pt-6 space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-display font-bold uppercase text-primary">Registration Complete!</h2>
                    <p className="text-sm text-muted-foreground">{success.message}</p>
                    <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                        <div>
                            <p className="font-mono text-xs text-muted-foreground uppercase mb-1">Team ID (Your Password)</p>
                            <p className="font-mono text-lg text-primary font-bold select-all">{success.teamId}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Use your email and the Team ID above to login.</p>
                    <Link href="/login">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold mt-2">
                            GO TO LOGIN
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto space-y-4">
            {/* Countdown Timer */}
            <CountdownTimer />

            <Card className="border-border bg-card/80 backdrop-blur-md w-full max-w-lg">
                <CardHeader className="space-y-1 pb-4">
                    {/* Live Stats Section - Inside the card */}
                    {configLoading ? (
                        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">Loading stats...</span>
                        </div>
                    ) : configError ? (
                        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4 text-center">
                            <p className="text-destructive text-sm">{configError}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Please check if the server is running</p>
                        </div>
                    ) : paymentConfig && (
                        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-center flex-1">
                                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Online Registered</p>
                                    <p className="text-2xl font-bold text-primary font-mono">
                                        {paymentConfig.onlineVerifiedCount}
                                    </p>
                                    <p className="text-[10px] text-green-500">of 80 slots</p>
                                </div>
                                <div className="h-12 w-px bg-border"></div>
                                <div className="text-center flex-1">
                                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Admin Approved</p>
                                    <p className="text-2xl font-bold text-purple-400 font-mono">
                                        {paymentConfig.adminAddedCount || 0}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">of 20 slots</p>
                                </div>
                                <div className="h-12 w-px bg-border"></div>
                                <div className="text-center flex-1">
                                    <p className="text-[10px] font-mono uppercase text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold text-foreground font-mono">
                                        {paymentConfig.onlineVerifiedCount + (paymentConfig.adminAddedCount || 0)}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">of 100 slots</p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
                                    style={{ 
                                        width: `${Math.min(100, ((paymentConfig.onlineVerifiedCount + (paymentConfig.adminAddedCount || 0)) / 100) * 100)}%` 
                                    }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
                                {Math.round(((paymentConfig.onlineVerifiedCount + (paymentConfig.adminAddedCount || 0)) / 100) * 100)}% filled • Live updates every 10s
                            </p>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                            <span className="font-display font-bold text-primary-foreground text-xs">H</span>
                        </div>
                    </div>
                    <CardTitle className="text-xl font-display font-bold text-center uppercase tracking-wider text-foreground">
                        Register <span className="text-primary">Team</span>
                    </CardTitle>
                    <CardDescription className="text-center font-mono text-xs text-muted-foreground">
                        Create your team profile for Hackthonix 2.0
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="grid gap-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="teamName" className="font-mono text-xs uppercase text-muted-foreground">Team Name</Label>
                            <Input
                                id="teamName"
                                placeholder="e.g. Binary Bandits"
                                disabled={isLoading}
                                className="bg-muted/50 border-border focus:border-primary/50"
                                required
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="collegeName" className="font-mono text-xs uppercase text-muted-foreground">College Name</Label>
                            <Input
                                id="collegeName"
                                placeholder="e.g. MIT, Stanford"
                                disabled={isLoading}
                                className="bg-muted/50 border-border focus:border-primary/50"
                                required
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="teamLeaderName" className="font-mono text-xs uppercase text-muted-foreground">Team Leader Name</Label>
                            <Input
                                id="teamLeaderName"
                                placeholder="e.g. John Doe"
                                disabled={isLoading}
                                className="bg-muted/50 border-border focus:border-primary/50"
                                required
                                value={teamLeaderName}
                                onChange={(e) => setTeamLeaderName(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="teamLeaderEmail" className="font-mono text-xs uppercase text-muted-foreground">Team Leader Email</Label>
                            <Input
                                id="teamLeaderEmail"
                                placeholder="e.g. leader@example.com"
                                type="email"
                                disabled={isLoading}
                                className="bg-muted/50 border-border focus:border-primary/50"
                                required
                                value={teamLeaderEmail}
                                onChange={(e) => setTeamLeaderEmail(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="teamLeaderPhone" className="font-mono text-xs uppercase text-muted-foreground">Team Leader Phone</Label>
                            <Input
                                id="teamLeaderPhone"
                                placeholder="e.g. 9876543210"
                                disabled={isLoading}
                                className="bg-muted/50 border-border focus:border-primary/50"
                                required
                                value={teamLeaderPhone}
                                onChange={(e) => setTeamLeaderPhone(e.target.value)}
                                maxLength={10}
                            />
                        </div>

                        {/* Payment Section - Only show if payment is enabled */}
                        {paymentConfig && paymentConfig.paymentEnabled && (
                            <div className="border border-primary/30 rounded-lg p-4 space-y-4 bg-primary/[0.02]">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    <Label className="font-mono text-xs uppercase text-primary">Payment Details</Label>
                                </div>

                                {/* Live Counter Display */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
                                        <p className="text-green-500 font-bold font-mono">Early Bird</p>
                                        <p className="text-muted-foreground">{paymentConfig.earlyBirdSlotsRemaining} slots left</p>
                                        <p className="text-green-500 font-mono">₹{paymentConfig.earlyBirdFee}/member</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
                                        <p className="text-blue-500 font-bold font-mono">Regular</p>
                                        <p className="text-muted-foreground">{paymentConfig.regularSlotsRemaining} slots left</p>
                                        <p className="text-blue-500 font-mono">₹{paymentConfig.regularFee}/member</p>
                                    </div>
                                </div>

                                {/* Current Tier Info */}
                                {paymentConfig.currentTier && (
                                    <div className="text-center text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-mono ${
                                            paymentConfig.currentTier === "EARLY_BIRD" 
                                                ? "bg-green-500/20 text-green-500" 
                                                : "bg-blue-500/20 text-blue-500"
                                        }`}>
                                            Current Tier: {paymentConfig.currentTier.replace("_", " ")}
                                        </span>
                                    </div>
                                )}

                                {/* QR Code Display */}
                                {paymentConfig.qrCodeUrl && (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-muted-foreground font-mono">Scan to Pay</p>
                                        <div className="relative w-32 h-32 bg-white rounded-lg border border-border p-1">
                                            <Image 
                                                src={paymentConfig.qrCodeUrl} 
                                                alt="Payment QR Code" 
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-center">UPI Payment via QR Code</p>
                                    </div>
                                )}

                                {/* Transaction ID Input */}
                                <div className="grid gap-2">
                                    <Label htmlFor="transactionId" className="font-mono text-xs uppercase text-muted-foreground">
                                        Transaction ID <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="transactionId"
                                        placeholder="Enter UPI Transaction ID"
                                        disabled={isLoading}
                                        className="bg-muted/50 border-border focus:border-primary/50 font-mono text-sm"
                                        required
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Required for payment verification. Find transaction ID in your UPI app.</p>
                                </div>

                                {/* Total Amount Display */}
                                {paymentConfig.currentFeePerMember && (
                                    <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Team Members:</span>
                                            <span className="font-mono">{totalMembers}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Fee per member:</span>
                                            <span className="font-mono">₹{paymentConfig.currentFeePerMember}</span>
                                        </div>
                                        <div className="border-t border-border my-1"></div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span>Total Payable:</span>
                                            <span className="font-mono text-primary">₹{paymentConfig.currentFeePerMember * totalMembers}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-mono text-xs uppercase text-muted-foreground">Additional Team Members</Label>
                                <span className="text-[10px] text-muted-foreground font-mono">{members.length}/3 Members (+ Team Leader = {members.length + 1}/4 Total)</span>
                            </div>

                            {members.map((member, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="grid gap-2 flex-1">
                                        <Input
                                            placeholder="Name"
                                            className="h-9 text-xs bg-muted/50 border-border"
                                            required
                                            value={member.name}
                                            onChange={(e) => updateMember(index, "name", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            className="h-9 text-xs bg-muted/50 border-border"
                                            required
                                            value={member.email}
                                            onChange={(e) => updateMember(index, "email", e.target.value)}
                                        />
                                    </div>
                                    {canRemoveMember && (
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => removeMember(index)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {canAddMember && (
                                <Button type="button" variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary/30 hover:bg-primary/[0.04] text-muted-foreground" onClick={addMember}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Member
                                </Button>
                            )}
                        </div>


                        {/* Registration Closed Message */}
                        {paymentConfig && !paymentConfig.onlineRegistrationOpen && paymentConfig.paymentEnabled && (
                            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                                <p className="text-destructive text-sm font-bold">Online Registration Closed</p>
                                <p className="text-[10px] text-muted-foreground mt-1">All online team slots have been filled. Please contact the organizers.</p>
                            </div>
                        )}

                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4 font-bold" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            INITIATE REGISTRATION
                        </Button>

                        <div className="text-center text-xs text-muted-foreground mt-2">
                            Already registered? <Link href="/login" className="text-primary hover:underline underline-offset-4">Login here</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
