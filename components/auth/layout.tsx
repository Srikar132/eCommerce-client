import { Card } from "../ui/card";


const AuthLayout = ({ children , title , mode }: { children: React.ReactNode , title: string , mode: "login" | "register" }) => {
    return (
         <div className="min-h-screen bg-linear-to-br from-background via-card to-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Auth Card */}
            <div className="w-full max-w-md relative z-10">
                <Card className="rounded-3xl shadow-2xl shadow-primary/5 p-8 sm:p-10">
                    {/* Header with Icon */}
                    <header className="text-center mb-8 space-y-4">
                       
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === "login" ? "Welcome back! Please enter your details." : "Create your account to get started."}
                        </p>
                    </header>

                    {/* Form Content */}
                    {children}

                    {/* Footer */}
                    <footer className="mt-8 pt-6 border-t border-border/50">
                        <p className="text-center text-sm text-muted-foreground">
                            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                            {mode === "login" ? (
                                <a 
                                    href="/register" 
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Sign Up
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            ) : (
                                <a 
                                    href="/login" 
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Login
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            )}
                        </p>
                    </footer>
                </Card>

                {/* Bottom Tagline */}
                <p className="text-center mt-6 text-xs text-muted-foreground/60">
                    Secure authentication powered by modern encryption
                </p>
            </div>
        </div>
    )
};

export default AuthLayout;
