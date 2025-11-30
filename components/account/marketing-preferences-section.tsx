'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface MarketingPreference {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8 lg:mb-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-3 sm:mb-4">MARKETING PREFERENCES</h1>
                <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                    Choose how you would like to hear from us about new products, offers, and updates.
                </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {preferences.map((pref) => (
                    <Card key={pref.id} className="border-zinc-200">
                        <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6 px-4 sm:px-6">
                            <div className="flex items-start justify-between gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                                    <h3 className="font-light text-base sm:text-lg tracking-wide">{pref.title}</h3>
                                    <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed">
                                        {pref.description}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 pt-1">
                                    <Switch
                                        checked={pref.enabled}
                                        onCheckedChange={(checked) => handleToggle(pref.id, checked)}
                                        className="data-[state=checked]:bg-black"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <Button
                        size="lg"
                        className="h-10 sm:h-12 px-6 sm:px-8 bg-black hover:bg-zinc-800 rounded-none font-light tracking-widest text-xs sm:text-sm w-full sm:w-auto"
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        SAVE PREFERENCES
                    </Button>
                    {hasChanges && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-10 sm:h-12 px-6 sm:px-8 border-zinc-300 rounded-none hover:bg-zinc-100 font-light tracking-widest text-xs sm:text-sm w-full sm:w-auto"
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
