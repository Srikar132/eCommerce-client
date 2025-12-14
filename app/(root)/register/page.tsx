import AuthLayout from '@/components/auth/layout'
import RegisterAuthForm from '@/components/auth/register-auth-form'
import React from 'react'

const Page = () => {
    return (
        <AuthLayout title="CREATE ACCOUNT" mode="register">
            {/* <LoginAuthForm /> */}
            <RegisterAuthForm />
        </AuthLayout>
    )
}
export default Page
