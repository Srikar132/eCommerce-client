// app/account/page.tsx
'use client';

import { useState } from 'react';
import  Sidebar  from '@/components/account/account-sidebar';
import { OrdersSection } from '@/components/account/orders-section';
import { SavedCardsSection } from '@/components/account/payment-cards-section';
import { SignInDetailsSection } from '@/components/account/login-details-section';
import { BillingAddressSection } from '@/components/account/billing-address-section';
import { MarketingPreferencesSection } from '@/components/account/marketing-preferences-section';
import { INITIAL_ORDERS, INITIAL_CARDS, INITIAL_ADDRESSES, INITIAL_PREFERENCES } from '@/constants';
import { Order, PaymentCard, Address, MarketingPreference, SignInDetails } from '@/lib/types';

export default function AccountPage() {
    const [activeSection, setActiveSection] = useState('orders');
    const [orders] = useState<Order[]>(INITIAL_ORDERS);
    const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [preferences, setPreferences] = useState<MarketingPreference[]>(INITIAL_PREFERENCES);
    const [userEmail] = useState('john.doe@example.com');

    // ============= HANDLERS =============
    const handleSignOut = () => {
        console.log('Signing out...');
        if (confirm('Are you sure you want to sign out?')) {
            alert('Signed out successfully!');
        }
    };

    const handleAddCard = () => {
        console.log('Add new card');
        alert('Add card form would open here');
    };

    const handleEditCard = (cardId: string) => {
        console.log('Edit card:', cardId);
        alert(`Edit card ${cardId} form would open here`);
    };

    const handleDeleteCard = (cardId: string) => {
        console.log('Delete card:', cardId);
        setCards(prev => prev.filter(card => card.id !== cardId));
    };

    const handleSetDefaultCard = (cardId: string) => {
        console.log('Set default card:', cardId);
        setCards(prev => prev.map(card => ({
            ...card,
            isDefault: card.id === cardId
        })));
    };

    const handleAddAddress = () => {
        console.log('Add new address');
        alert('Add address form would open here');
    };

    const handleEditAddress = (addressId: string) => {
        console.log('Edit address:', addressId);
        alert(`Edit address ${addressId} form would open here`);
    };

    const handleDeleteAddress = (addressId: string) => {
        console.log('Delete address:', addressId);
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    };

    const handleSetDefaultAddress = (addressId: string) => {
        console.log('Set default address:', addressId);
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        })));
    };

    const handleUpdateCredentials = (data: SignInDetails) => {
        console.log('Update credentials:', data);
        alert('Credentials updated successfully!');
    };

    const handleTogglePreference = (prefId: string, enabled: boolean) => {
        console.log('Toggle preference:', prefId, enabled);
        setPreferences(prev => prev.map(pref =>
            pref.id === prefId ? { ...pref, enabled } : pref
        ));
    };

    const handleSavePreferences = () => {
        console.log('Save preferences:', preferences);
        alert('Preferences saved successfully!');
    };

    // ============= SECTION CONFIGURATION (BETTER APPROACH) =============
    // This is a cleaner, more maintainable way to handle multiple sections
    const sectionConfig: Record<string, React.ReactNode> = {
        orders: <OrdersSection orders={orders} />,
        cards: (
            <SavedCardsSection
                cards={cards}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onSetDefaultCard={handleSetDefaultCard}
            />
        ),
        signin: (
            <SignInDetailsSection
                currentEmail={userEmail}
                onUpdateCredentials={handleUpdateCredentials}
            />
        ),
        address: (
            <BillingAddressSection
                addresses={addresses}
                onAddAddress={handleAddAddress}
                onEditAddress={handleEditAddress}
                onDeleteAddress={handleDeleteAddress}
                onSetDefaultAddress={handleSetDefaultAddress}
            />
        ),
        preferences: (
            <MarketingPreferencesSection
                preferences={preferences}
                onTogglePreference={handleTogglePreference}
                onSavePreferences={handleSavePreferences}
            />
        ),
    };

    // ============= MAIN RENDER =============
    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onSignOut={handleSignOut}
                />
                <main className="flex-1 p-8 lg:p-12 flex justify-center">
                    <div className="w-full">
                        {sectionConfig[activeSection] || sectionConfig.orders}
                    </div>
                </main>
            </div>
        </div>
    );
}