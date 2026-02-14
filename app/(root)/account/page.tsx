import { AccountDetailsSection } from '@/components/account/account-details-section';
import { UserStatsSection } from '@/components/account/user-stats-section';
import { AddressesSectionClient } from '@/components/account/addresses-section';
import { QuickActionsSection } from '@/components/account/quick-actions-section';
import RoleBasedWelcome from '@/components/auth/role-based-welcome';

export const metadata = {
    title: 'My Account',
    description: 'Manage your account settings and preferences',
};

export default function AccountPage() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
            {/* Authentication Welcome Section */}
            <div className="mb-8">
                <RoleBasedWelcome />
            </div>

            {/* Page Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Account Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your personal information, orders, and preferences
                </p>
            </div>

            {/* Main Grid Layout */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
                {/* Left Column - Account Details & Stats */}
                <div className="space-y-4 md:space-y-6 lg:col-span-2">
                    {/* Account Details */}
                    <AccountDetailsSection />

                    {/* User Stats */}
                    <UserStatsSection />

                    {/* Addresses Section */}
                    <AddressesSectionClient />
                </div>

                {/* Right Column - Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-6">
                        <QuickActionsSection />
                    </div>
                </div>
            </div>
        </div>
    );
}
