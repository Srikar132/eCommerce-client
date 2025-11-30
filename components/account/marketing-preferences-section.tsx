'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MarketingPreference } from '@/lib/types';

interface MarketingPreferencesSectionProps {
    preferences: MarketingPreference[];
    onTogglePreference: (prefId: string, enabled: boolean) => void;
    onSavePreferences: () => void;
}

export const MarketingPreferencesSection: React.FC<MarketingPreferencesSectionProps> = ({
                                                                                            preferences,
                                                                                            onTogglePreference,
                                                                                            onSavePreferences
                                                                                        }) => {
    const [hasChanges, setHasChanges] = useState(false);

    const handleToggle = (prefId: string, enabled: boolean) => {
        onTogglePreference(prefId, enabled);
        setHasChanges(true);
    };

    const handleSave = () => {
        onSavePreferences();
        setHasChanges(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-light tracking-wide mb-4">MARKETING PREFERENCES</h1>
                <p className="text-zinc-600 font-light leading-relaxed">
                    Choose how you would like to hear from us about new products, offers, and updates.
                </p>
            </div>

            <div className="space-y-4">
                {preferences.map((pref) => (
                    <Card key={pref.id} className="border-zinc-200">
                        <CardContent className="pt-6 pb-6">
                            <div className="flex items-start justify-between gap-6">
                                <div className="space-y-2 flex-1">
                                    <h3 className="font-light text-lg tracking-wide">{pref.title}</h3>
                                    <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                                        {pref.description}
                                    </p>
                                </div>
                                <Switch
                                    checked={pref.enabled}
                                    onCheckedChange={(checked) => handleToggle(pref.id, checked)}
                                    className="data-[state=checked]:bg-black"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex gap-4 pt-6">
                    <Button
                        size="lg"
                        className="h-12 px-8 bg-black hover:bg-zinc-800 rounded-none font-light tracking-widest"
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        SAVE PREFERENCES
                    </Button>
                    {hasChanges && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 px-8 border-zinc-300 rounded-none hover:bg-zinc-100 font-light tracking-widest"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            DISCARD CHANGES
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};