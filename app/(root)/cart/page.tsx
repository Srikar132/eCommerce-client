"use client"

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { CartItem, cartProduct } from '@/lib/types';
import { sampleProducts, customersAlsoBought, recentlyViewedProducts } from '@/constants';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { SavedForLaterCard } from '@/components/cart/saved-for-later-card';
import { OrderSummary } from '@/components/cart/order-summary';
import { CustomersAlsoBought } from '@/components/cart/customers-also-bought';
import { RecentlyViewed } from '@/components/cart/recently-viewed';
import { Button } from '@/components/ui/button';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(
        sampleProducts.map(product => ({ ...product, quantity: 1 }))
    );
    const [savedItems, setSavedItems] = useState<cartProduct[]>([]);

    const handleQuantityChange = (id: string, quantity: number) => {
        setCartItems(items =>
            items.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const handleSizeChange = (id: string, size: string) => {
        setCartItems(items =>
            items.map(item => item.id === id ? { ...item, size } : item)
        );
    };

    const handleSaveForLater = (id: string) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            // Remove the quantity property when saving for later
            const { quantity, ...productWithoutQuantity } = item;
            setSavedItems([...savedItems, productWithoutQuantity]);
            setCartItems(cartItems.filter(item => item.id !== id));
        }
    };

    const handleMoveToBag = (id: string) => {
        const item = savedItems.find(item => item.id === id);
        if (item) {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
            setSavedItems(savedItems.filter(item => item.id !== id));
        }
    };

    const handleRemoveFromCart = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleRemoveFromSaved = (id: string) => {
        setSavedItems(savedItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const deliveryCost = 450;
    const total = calculateTotal();
    const isEmpty = cartItems.length === 0;

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-gray-900">
                        Shopping Bag {!isEmpty && `(${cartItems.length})`}
                    </h1>
                    <Button variant="link" className="p-0 h-auto font-medium text-gray-600 hover:text-gray-900">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Continue Shopping
                    </Button>
                </div>

                {isEmpty ? (
                    <div className="text-center py-16 sm:py-24">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-lg sm:text-xl font-medium mb-3 text-gray-900">Your bag is empty</h2>
                            <p className="text-gray-600 text-sm mb-6">Looks like you haven't added anything to your bag yet.</p>
                            <Button className="px-8 py-3">
                                Start Shopping
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 overflow-x-hidden">
                        {/* Main Content */}
                        <div className="w-full min-w-0 overflow-x-hidden space-y-8">
                            {/* Customs Notice */}
                            <div className="border-l-4 border-gray-400 pl-4 py-4 bg-gray-50 text-sm text-gray-700 leading-relaxed">
                                <p className="font-medium mb-1">Customs Information</p>
                                <p>Customs duties/taxes are not included in our prices. DPD International will contact you to arrange payment and request a valid KYC ID for customs clearance before dispatching your parcel.</p>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-6">
                                {cartItems.map(item => (
                                    <CartItemCard
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                        onSaveForLater={handleSaveForLater}
                                        onRemove={handleRemoveFromCart}
                                        onSizeChange={handleSizeChange}
                                    />
                                ))}
                            </div>

                            {/* Mobile Order Summary */}
                            <div className="lg:hidden">
                                <OrderSummary
                                    total={total}
                                    deliveryCost={deliveryCost}
                                    onCheckout={() => alert('Proceeding to checkout...')}
                                />
                            </div>

                            {/* Saved For Later */}
                            <div className="border-t pt-8">
                                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900">
                                    Saved For Later ({savedItems.length})
                                </h2>

                                {savedItems.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            {savedItems.map(item => (
                                                <SavedForLaterCard
                                                    key={item.id}
                                                    item={item}
                                                    onMoveToBag={handleMoveToBag}
                                                    onRemove={handleRemoveFromSaved}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                            Items saved for later are stored temporarily. Availability and pricing may change.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-2">No saved items</h3>
                                        <p className="text-gray-600 text-sm">
                                            Items you save for later will appear here.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Customers Also Bought */}
                            <div className="border-t pt-8">
                                <CustomersAlsoBought products={customersAlsoBought} />
                            </div>
                        </div>

                        {/* Sidebar - Order Summary - Desktop Only */}
                        <div className="hidden xl:block w-full min-w-0">
                            <div className="sticky top-6">
                                <OrderSummary
                                    total={total}
                                    deliveryCost={deliveryCost}
                                    onCheckout={() => alert('Proceeding to checkout...')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Recently Viewed */}
                <div className="border-t pt-8 mt-12">
                    <RecentlyViewed
                        products={recentlyViewedProducts}
                        cartItemIds={cartItems.map(item => item.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartPage;