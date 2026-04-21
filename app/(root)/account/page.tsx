import { AccountDetailsSection } from '@/components/account/account-details-section';
import { AddressesSectionClient } from '@/components/account/addresses-section';
import RoleBasedWelcome from '@/components/auth/role-based-welcome';
import LogoutButton from '@/components/auth/logout-button';
import BreadcrumbNavigation from '@/components/breadcrumb-navigation';

export const metadata = {
    title: 'My Account',
    description: 'Manage your account settings and preferences',
};

export default function AccountPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <div className="mb-8">
                <BreadcrumbNavigation />
            </div>
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="text-left">
                    <h1 className="h1 mb-3">My Account</h1>
                    <p className="p-base text-muted-foreground max-w-xl">
                        Manage your personal information and delivery preferences in your private dashboard.
                    </p>
                </div>
                <div className="w-full md:w-auto min-w-[160px]">
                    <LogoutButton />
                </div>
            </div>

            <div className="space-y-10">
                <RoleBasedWelcome />
                
                <div className="grid gap-10">
                    <AccountDetailsSection />
                    <AddressesSectionClient />
                </div>
            </div>
        </div>
    );
}
