"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { logout } from "@/lib/actions/auth-actions";
import { getStoreSettings, updateStoreSettings, type StoreSettingsData } from "@/lib/actions/store-settings-actions";
import {
    Mail,
    Phone,
    Sun,
    Moon,
    LogOut,
    Save,
    MapPin,
    Building2,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Settings State
    const [settings, setSettings] = useState<StoreSettingsData | null>(null);

    useEffect(() => {
        setMounted(true);
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getStoreSettings();
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        setIsSaving(true);
        try {
            const result = await updateStoreSettings({
                email: settings.email,
                phone: settings.phone,
                address: settings.address,
                city: settings.city,
                state: settings.state,
                pincode: settings.pincode,
                country: settings.country,
            });

            if (result.success) {
                toast.success(result.message);
                if (result.data) setSettings(result.data);
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            window.location.href = "/";
        } catch {
            toast.error("Failed to logout");
            setIsLoggingOut(false);
        }
    };

    const updateField = (field: keyof StoreSettingsData, value: string) => {
        if (settings) {
            setSettings({ ...settings, [field]: value });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto py-2 md:py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/60">
                <div className="space-y-1.5">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground/90 uppercase">
                        Admin Settings
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Configure your store's global identity, contact preferences, and personalize your administrative experience.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="admin-primary-button gap-2 rounded-full px-6 shadow-xl"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Store Identity & Contact */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Store Identity */}
                    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl shadow-sm">
                        <CardHeader className="border-b border-border/50 pb-6 bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Store Identity</CardTitle>
                                    <CardDescription className="text-xs uppercase tracking-widest font-bold opacity-70">Physical & Business Presence</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                            {/* Contact Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            type="email"
                                            value={settings?.email || ""}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            className="admin-input pl-11 rounded-xl"
                                            placeholder="support@nalaarmoire.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone Support</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            value={settings?.phone || ""}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                            className="admin-input pl-11 rounded-xl"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border/40" />

                            {/* Address Section */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Street Address</Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            value={settings?.address || ""}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            className="admin-input pl-11 rounded-xl"
                                            placeholder="Corporate Office, 4th Floor"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">City</Label>
                                        <Input
                                            value={settings?.city || ""}
                                            onChange={(e) => updateField("city", e.target.value)}
                                            className="admin-input rounded-xl"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">State</Label>
                                        <Input
                                            value={settings?.state || ""}
                                            onChange={(e) => updateField("state", e.target.value)}
                                            className="admin-input rounded-xl"
                                            placeholder="MH"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Pincode</Label>
                                        <Input
                                            value={settings?.pincode || ""}
                                            onChange={(e) => updateField("pincode", e.target.value)}
                                            className="admin-input rounded-xl"
                                            placeholder="400001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preferences & Account */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Appearance Preference */}
                    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl shadow-sm">
                        <CardHeader className="border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                    {mounted && theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Preferences</CardTitle>
                                    <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-70">UI & Accessibility</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Theme Mode</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                        {mounted ? (theme === "dark" ? "Dark" : "Light") : "Loading..."}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="rounded-full h-9 px-4 admin-glow-button"
                                    disabled={!mounted}
                                >
                                    {mounted && theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                                    Switch
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security & Session */}
                    <Card className="border border-destructive/20 bg-destructive/5 overflow-hidden rounded-3xl shadow-sm">
                        <CardHeader className="border-b border-destructive/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-destructive/90">Security</CardTitle>
                                    <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-destructive/60">Session Management</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <p className="text-xs text-muted-foreground leading-relaxed px-1">
                                    Once you sign out, you will need to re-authenticate to access the administrative dashboard.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full rounded-2xl h-11 font-bold tracking-tight shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02]"
                                >
                                    {isLoggingOut ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Terminate Session
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata Info */}
                    {settings?.updatedAt && (
                        <div className="px-4 py-3 rounded-2xl bg-muted/20 border border-border/40 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Last Synchronized</p>
                            <p className="text-xs font-bold text-foreground/70">
                                {new Date(settings.updatedAt).toLocaleString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
