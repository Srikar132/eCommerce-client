import { Card } from "../ui/card";
import { Sparkles } from "lucide-react";


const AuthLayout = ({ children , title , mode }: { children: React.ReactNode , title: string , mode: "login" | "register" }) => {
    return (
         <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md relative z-10">
                <Card className="backdrop-blur-sm p-8 sm:p-10 border-border/50">
                    {/* Header with Icon */}
                    <header className="text-center mb-8 space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/50 mb-2">
                            <Sparkles className="h-7 w-7 text-primary" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-foreground tracking-wide">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground tracking-wide">
                            {mode === "login" ? "Welcome back to The Nala Armoire" : "Join our handcrafted community"}
                        </p>
                    </header>

                    {/* Form Content */}
                    {children}

                    {/* Footer */}
                    <footer className="mt-8 pt-6 border-t border-border/30">
                        <p className="text-center text-xs text-muted-foreground tracking-wide">
                            Handcrafted with love, secured with care
                        </p>
                    </footer>
                </Card>

                {/* Bottom Tagline */}
                <p className="text-center mt-6 text-xs text-muted-foreground/80 tracking-widest uppercase">
                    The Nala Armoire
                </p>
            </div>
        </div>
    )
};

export default AuthLayout;
