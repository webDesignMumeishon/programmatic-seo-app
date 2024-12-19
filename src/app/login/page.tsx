import LoginForm from '@/components/login-form'
import { verifySession } from '@/lib/dal'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
}

export default async function LoginPage() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
                    <p className="text-lg text-muted-foreground">
                        Enter the credentials to sign in.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}