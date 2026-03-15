import { Suspense } from "react";
import LoginAuthForm from "@/components/auth/login-auth-form";
import AuthLayout from "@/components/auth/layout";

const Page = () => {
    return (
        <AuthLayout>
            <Suspense fallback={null}>
                <LoginAuthForm />
            </Suspense>
        </AuthLayout>
    )
}
export default Page
