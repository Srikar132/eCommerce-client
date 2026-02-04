import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart, MapPin, ShoppingBag, Edit2, AlertCircle } from 'lucide-react';
import RecentOrdersSection from '@/components/account/recent-orders-section';
import { auth } from '@/auth';


export default async function AccountPage() {
    const session = await auth();

    const user = session?.user;

    return (
        <section className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <Card className="mb-8 overflow-hidden border-border bg-linear-to-br from-card via-card to-accent/10 shadow-lg">
                    <CardContent className="p-8 lg:p-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-card"></div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-3xl lg:text-4xl font-serif font-light text-foreground">
                                        {user?.name || 'Welcome!'}
                                    </h1>
                                    {user?.email && (
                                        <p className="text-base text-muted-foreground flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                            {user.email}
                                        </p>
                                    )}
                                    {user?.phone && (
                                        <p className="text-base text-muted-foreground flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                            {user.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Link href="/account/account-details">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full h-12 w-12 shadow-md transition-all duration-300 hover:scale-110"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>


                {/* Recent Orders Section */}
                {/* <RecentOrdersSection /> */}

                {/* Quick Actions */}
                <Card className="border-border shadow-lg bg-card overflow-hidden">
                    <CardContent className="p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-serif font-light text-foreground mb-2">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground">Access your account features</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/account/orders" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Package className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Track Orders
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/wishlist" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Wishlist
                                    </p>
                                </div>
                            </Link>
                            <Link href="/account/addresses" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Addresses
                                    </p>
                                </div>
                            </Link>
                            <Link href="/products" className="group">
                                <div className="p-6 rounded-2xl bg-linear-to-br from-secondary to-accent hover:from-accent hover:to-primary/10 transition-all duration-300 text-center shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                    <div className="bg-card/80 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <ShoppingBag className="h-6 w-6 text-primary group-hover:text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        Shop Now
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>


            </div>
        </section>
    );
}