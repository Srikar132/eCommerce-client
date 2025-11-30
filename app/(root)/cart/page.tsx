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
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
                    <h1 className="text-center sm:text-base lg:text-2xl font-semibold tracking-widest">
                        SHOPPING BAG {!isEmpty && `(${cartItems.length})`}
                    </h1>
                    <Button variant="link" className="p-0 h-auto font-semibold">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Shop More
                    </Button>
                </div>

                {isEmpty ? (
                    <div className="text-center py-12 sm:py-20">
                        <h2 className="text-base sm:text-lg font-semibold mb-2 tracking-widest">SHOPPING BAG</h2>
                        <p className="text-gray-600 text-sm">Your bag is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 xl:gap-8">
                        {/* Main Content */}
                        <div className="w-full">
                            {/* Customs Notice */}
                            <div className="border-l-4 border-gray-500 pl-3 pt-4 pb-4 sm:pl-4 font-medium bg-zinc-100  mb-6 sm:mb-8 text-xs sm:text-sm text-gray-900 leading-relaxed">
                                Customs duties/taxes are not included in our prices. DPD International will contact you to arrange payment and request a valid KYC ID for customs clearance before dispatching your parcel.
                            </div>

                            {/* Cart Items */}
                            <div>
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

                            {/* Bottom Total Summary - Desktop Only */}
                            <div className="hidden xl:block py-6 border-b">
                                <div className="flex justify-end items-start gap-16 lg:gap-32">
                                    <div className="text-right">
                                        <p className="text-sm font-medium mb-1">Total:</p>
                                        <p className="text-xs font-medium text-gray-600">
                                            Excluding Standard Delivery (Normally INR 450.00)
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold">INR {total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile/Tablet Order Summary */}
                            <div className="xl:hidden mt-6">
                                <OrderSummary
                                    total={total}
                                    deliveryCost={deliveryCost}
                                    onCheckout={() => alert('Proceeding to checkout...')}
                                />
                            </div>

                            {/* Shop More Link */}
                            <Button variant="link" className="mt-6 p-0 h-auto font-medium">
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Shop More
                            </Button>

                            {/* Saved For Later */}
                            <div className="mt-8 sm:mt-12">
                                <h2 className="lg:text-xl sm:text-base text-center font-semibold mb-4 sm:mb-6 tracking-wide">
                                    Saved For Later ({savedItems.length})
                                </h2>

                                {savedItems.length > 0 ? (
                                    <>
                                        <div>
                                            {savedItems.map(item => (
                                                <SavedForLaterCard
                                                    key={item.id}
                                                    item={item}
                                                    onMoveToBag={handleMoveToBag}
                                                    onRemove={handleRemoveFromSaved}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 mt-4 sm:mt-6 leading-relaxed">
                                            Items that are Saved for Later are stored temporarily, with availability and pricing subject to change.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gray-50 p-6 sm:p-8 text-center border">
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Items will appear here as you save them from your shopping bag.
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                                            Items that are Saved for Later are stored temporarily, with availability and pricing subject to change.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Customers Also Bought */}
                            <CustomersAlsoBought products={customersAlsoBought} />
                        </div>

                        {/* Sidebar - Order Summary - Desktop Only */}
                        <div className="hidden xl:block w-full">
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
                <RecentlyViewed
                    products={recentlyViewedProducts}
                    cartItemIds={cartItems.map(item => item.id)}
                />
            </div>
        </div>
    );
};

export default CartPage;