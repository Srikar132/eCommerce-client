"use client";

import React, {useState} from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface AuthFormsProps {
    mode?: "login" | "signup";
}

export default function AuthForms({ mode = "signup" } : AuthFormsProps) {
    const [isLogin , setIsLogin] = useState(mode === "login");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validateForm = () => {
        const newErrors : Record<string, string> = {};

        if(!isLogin) {
            if(!formData.username.trim()) newErrors.username = "Please enter your username";
        }
        if(!formData.email.trim()) newErrors.email = "Please enter a valid email address";
        else if(!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";

        if(!formData.password) newErrors.password = "Please enter your password";
        else if(formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        setSuccessMessage("");

        if(validateForm()) {
            setSuccessMessage(isLogin ? "Login successful" : "Account created successfully.");
            setFormData({username: "", email: "", password: "", });
            setErrors({});
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
        if(errors[name]) setErrors(prev => ({...prev, [name]: ""}));
    }

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({username: "", email: "", password: "", });
        setErrors({});
        setSuccessMessage("");
    }

    return (
        <div className="auth-section">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">
                        {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
                    </h1>
                </div>

                <div className="auth-form">
                    {!isLogin && (
                        <div className="auth-input-group">
                            <Input
                                name="username"
                                type="text"
                                placeholder="User name"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={errors.username ? "auth-input-error" : "auth-input"}
                            />
                            {errors.username && <p className="auth-error-text">{errors.username}</p>}
                        </div>
                    )}

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <Label className="auth-label-floating">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? "auth-input-error" : "auth-input"}
                            />
                        </div>
                        {errors.email && <p className="auth-error-text">{errors.email}</p>}
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <Label className="auth-label-floating">Password</Label>
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                className={errors.password ? "auth-input-error pr-10" : "auth-input pr-10"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="auth-password-toggle"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="auth-error-text">{errors.password}</p>}
                    </div>

                    {successMessage && (
                        <Alert className="auth-success-alert">
                            <AlertDescription className="auth-success-text">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <Button onClick={handleSubmit} className="auth-submit-btn">
                        {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
                    </Button>

                    <div className="auth-divider">
                        <div className="auth-divider-line">
                            <span className="auth-divider-border"></span>
                        </div>
                        <div className="auth-divider-text">
                            <span className="auth-divider-label">OR</span>
                        </div>
                    </div>

                    <Button variant="outline" className="auth-oauth-btn">
                        <div className="auth-oauth-icon-wrapper">
                            <Image src="/home/footer/google.jpeg" alt="Google Logo" width={50} height={50} />
                        </div>
                        Continue with Google
                    </Button>

                    <div className="auth-toggle-wrapper">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={toggleForm} className="auth-toggle-link">
                            {isLogin ? "Create account" : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}