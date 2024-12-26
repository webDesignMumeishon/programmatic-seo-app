import { verifyEmail, createUserSession } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function VerificationPage({
    params
}: {
    params: { token: string }
}) {
    try {
        console.log("Attempting to verify token:", params.token);
        const result = await verifyEmail(params.token)
        
        if (result.success && result.userName) {
            await createUserSession(result.userName)
            redirect('/form')
        }
        
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
                <p>Redirecting to dashboard...</p>
            </div>
        )
    } catch (error) {
        console.error("Error in verification page:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h1>
                <p className="text-red-500">
                    {error instanceof Error ? error.message : 'Something went wrong'}
                </p>
                <a href="/login" className="mt-4 text-blue-500 hover:underline">
                    Back to login
                </a>
            </div>
        )
    }
} 