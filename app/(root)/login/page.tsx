import LoginAuthForm from "@/components/auth/login-auth-form";
import AuthLayout from "@/components/auth/layout";

const Page = () => {
    return (
        <AuthLayout title="LOGIN" mode="login">
            <LoginAuthForm />
        </AuthLayout>
    )
}
export default Page
