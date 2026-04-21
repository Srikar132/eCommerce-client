import { Suspense } from "react";
import LoginAuthForm from "@/components/auth/login-auth-form";
import AuthLayout from "@/components/auth/layout";


const Page = () => {
    return (
        <div className="container mx-auto px-4 pt-10">

            <AuthLayout>
                <Suspense fallback={null}>
                    <LoginAuthForm />
                </Suspense>
            </AuthLayout>
        </div>
    )
}
export default Page
