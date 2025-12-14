import LogoutButton from "@/components/auth/logout-button";
import { getServerAuth } from "@/lib/auth/server";


export default async function AccountPage() {
    const auth = await getServerAuth();
    const user = auth.user;

    return (
        <div className="min-h-screen p-5  flex flex-col items-center justify-center space-y-5">
            <h1>Account Page</h1>

            <p className="mb-4">Welcome, {user?.email}</p>


            <LogoutButton/>
        </div>
    );
}