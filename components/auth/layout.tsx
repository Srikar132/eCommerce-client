import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex-1 bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Elegant Decorative Background */}
            {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-linear-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl opacity-40" />
                <div className="absolute -bottom-32 -left-32 w-md h-112 bg-linear-to-tr from-accent/25 via-accent/15 to-transparent rounded-full blur-3xl opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-128 bg-linear-to-r from-primary/5 to-accent/5 rounded-full blur-3xl opacity-30" />
            </div> */}

            {/* Main Auth Container with elegant card */}
            <div className="w-full max-w-md relative z-10">
                {/* Elegant Card Container */}
                <div className="p-8 sm:p-10">
                    {/* Brand Header - Matches your site's style */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 shadow-sm">
                                <span className="text-2xl font-serif italic text-primary">N</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-light text-foreground mb-2 tracking-wide">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-muted-foreground font-light italic tracking-wide">
                            Sign in to continue your journey
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-6">
                        {children}
                    </div>

                    {/* Decorative divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-3 text-muted-foreground font-light tracking-widest">
                                Secure Login
                            </span>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center space-y-4">
                        <p className="text-xs text-muted-foreground font-light">
                            Need assistance?{" "}
                            <Link href={"/contact"} className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-2 hover:underline">
                                Contact Support
                            </Link >
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <div className="h-px w-8 bg-linear-to-r from-transparent to-border"></div>
                            <p className="text-[10px] text-muted-foreground/60 font-light tracking-wider uppercase">
                                Handcrafted with Love
                            </p>
                            <div className="h-px w-8 bg-linear-to-l from-transparent to-border"></div>
                        </div>
                    </div>
                </div>

                {/* Subtle decorative accent below card */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground/50 font-light italic">
                        Protected by industry-leading security
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;