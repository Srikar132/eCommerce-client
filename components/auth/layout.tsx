

const AuthLayout = ({ children , title , mode }: { children: React.ReactNode , title: string , mode: "login" | "register" }) => {
    return (
         <div className="auth-section">
            <div className="auth-container">
                <header className="auth-header">
                    <h1 className="auth-title">
                        {title}
                    </h1>
                </header>

                {children}

                <footer className="auth-footer">
                    <p className="auth-footer-text">
                        Don't have an account?{" "}
                        {mode === "login" ? (
                            <a href="/register" className="auth-footer-link">
                                Sign Up
                            </a>
                        ) : (
                            <a href="/login" className="auth-footer-link">
                                Login
                            </a>
                        )}
                    </p>
                </footer>
            </div>
        </div>
    )
};

export default AuthLayout;
