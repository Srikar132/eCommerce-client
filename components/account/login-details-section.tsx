'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SignInDetails {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface SignInDetailsSectionProps {
    currentEmail: string;
    onUpdateCredentials: (data: SignInDetails) => void;
}

export const SignInDetailsSection: React.FC<SignInDetailsSectionProps> = ({
    currentEmail,
    onUpdateCredentials
}) => {
    const [formData, setFormData] = useState<SignInDetails>({
        email: currentEmail,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Partial<SignInDetails>>({});

    const handleChange = (field: keyof SignInDetails, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<SignInDetails> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password required to change password';
            }
            if (formData.newPassword.length < 8) {
                newErrors.newPassword = 'Password must be at least 8 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onUpdateCredentials(formData);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8 lg:mb-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-3 sm:mb-4">EDIT SIGN IN DETAILS</h1>
                <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                    Update your email address and password for account security.
                </p>
            </div>

            <Card className="border-zinc-200 rounded-none shadow-sm">
                <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8 px-4 sm:px-6">
                    <div className="space-y-6 sm:space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-medium tracking-wide text-zinc-700">
                                EMAIL ADDRESS *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="h-10 sm:h-12 border-zinc-300 focus:border-zinc-500 font-light text-sm sm:text-base"
                            />
                            {errors.email && <p className="text-sm text-red-600 font-light">{errors.email}</p>}
                        </div>

                        <Separator className="bg-zinc-200" />

                        <div className="space-y-6">
                            <p className="text-xs sm:text-sm font-light tracking-wide text-zinc-700">CHANGE PASSWORD (OPTIONAL)</p>

                            <div className="space-y-3">
                                <Label htmlFor="current-password" className="text-xs sm:text-sm font-medium tracking-wide text-zinc-700">
                                    CURRENT PASSWORD
                                </Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                                    placeholder="Enter current password"
                                    className="h-10 sm:h-12 border-zinc-300 focus:border-zinc-500 font-light text-sm sm:text-base"
                                />
                                {errors.currentPassword && <p className="text-sm text-red-600 font-light">{errors.currentPassword}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="new-password" className="text-xs sm:text-sm font-medium tracking-wide text-zinc-700">
                                    NEW PASSWORD
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => handleChange('newPassword', e.target.value)}
                                    placeholder="Enter new password (min 8 characters)"
                                    className="h-10 sm:h-12 border-zinc-300 focus:border-zinc-500 font-light text-sm sm:text-base"
                                />
                                {errors.newPassword && <p className="text-sm text-red-600 font-light">{errors.newPassword}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="confirm-password" className="text-xs sm:text-sm font-medium tracking-wide text-zinc-700">
                                    CONFIRM NEW PASSWORD
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="h-10 sm:h-12 border-zinc-300 focus:border-zinc-500 font-light text-sm sm:text-base"
                                />
                                {errors.confirmPassword && <p className="text-sm text-red-600 font-light">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                            <Button 
                                onClick={handleSubmit}
                                size="lg" 
                                className="h-10 sm:h-12 px-6 sm:px-8 bg-black hover:bg-zinc-800 font-light tracking-widest text-xs sm:text-sm w-full sm:w-auto"
                            >
                                SAVE CHANGES
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-10 sm:h-12 px-6 sm:px-8 border-zinc-300 hover:bg-zinc-100 font-light tracking-widest text-xs sm:text-sm w-full sm:w-auto"
                                onClick={() => {
                                    setFormData({
                                        email: currentEmail,
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                    setErrors({});
                                }}
                            >
                                RESET
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
