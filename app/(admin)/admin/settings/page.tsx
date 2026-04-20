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
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="admin-page-title">Settings</h1>
                <p className="admin-page-description mt-2">
                    Manage store settings and preferences
                </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">

                {/* Contact Information Card */}
                <Card className="admin-card">
                    <CardHeader className="admin-card-header">
                        <div className="flex items-center gap-3">
                            <div className="admin-card-header-icon">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                                <CardDescription>
                                    Update store contact details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="admin-label">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings?.email || ""}
                                onChange={(e) => updateField("email", e.target.value)}
                                className="admin-input"
                                placeholder="support@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="admin-label">
                                <Phone className="h-4 w-4" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                value={settings?.phone || ""}
                                onChange={(e) => updateField("phone", e.target.value)}
                                className="admin-input"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address Card */}
                <Card className="admin-card">
                    <CardHeader className="admin-card-header">
                        <div className="flex items-center gap-3">
                            <div className="admin-card-header-icon">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Store Address</CardTitle>
                                <CardDescription>
                                    Business location details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address" className="admin-label">
                                <Building2 className="h-4 w-4" />
                                Street Address
                            </Label>
                            <Input
                                id="address"
                                value={settings?.address || ""}
                                onChange={(e) => updateField("address", e.target.value)}
                                className="admin-input"
                                placeholder="123, Fashion Street"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="admin-label">City</Label>
                                <Input
                                    id="city"
                                    value={settings?.city || ""}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    className="admin-input"
                                    placeholder="Mumbai"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="admin-label">State</Label>
                                <Input
                                    id="state"
                                    value={settings?.state || ""}
                                    onChange={(e) => updateField("state", e.target.value)}
                                    className="admin-input"
                                    placeholder="Maharashtra"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="pincode" className="admin-label">Pincode</Label>
                                <Input
                                    id="pincode"
                                    value={settings?.pincode || ""}
                                    onChange={(e) => updateField("pincode", e.target.value)}
                                    className="admin-input"
                                    placeholder="400001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="admin-label">Country</Label>
                                <Input
                                    id="country"
                                    value={settings?.country || ""}
                                    onChange={(e) => updateField("country", e.target.value)}
                                    className="admin-input"
                                    placeholder="India"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Card */}
                <Card className="admin-card">
                    <CardHeader className="admin-card-header">
                        <div className="flex items-center gap-3">
                            <div className="admin-card-header-icon">
                                {mounted && theme === "dark" ? (
                                    <Moon className="h-5 w-5 text-primary" />
                                ) : (
                                    <Sun className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-lg">Appearance</CardTitle>
                                <CardDescription>
                                    Customize dashboard look
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="admin-settings-row">
                            <div>
                                <p className="font-medium">Theme Mode</p>
                                <p className="text-sm text-muted-foreground">
                                    {mounted ? (theme === "dark" ? "Dark mode is active" : "Light mode is active") : "Loading..."}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="admin-glow-button gap-2"
                                disabled={!mounted}
                            >
                                {mounted && theme === "dark" ? (
                                    <>
                                        <Sun className="h-4 w-4" />
                                        Light
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-4 w-4" />
                                        Dark
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Card */}
                <Card className="admin-card">
                    <CardHeader className="bg-destructive/5 border-b border-destructive/20">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                                <LogOut className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Account</CardTitle>
                                <CardDescription>
                                    Session management
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-muted-foreground">
                                    End your current session
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Save Button */}
            <div className="max-w-6xl mx-auto mt-8">
                <div className="flex justify-center">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="lg"
                        className="admin-primary-button gap-2 px-8"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save All Changes
                            </>
                        )}
                    </Button>
                </div>
                {settings?.updatedAt && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                        Last updated: {new Date(settings.updatedAt).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}
