import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import SEOForm from '@/components/seo-form'
import { verifySession } from '@/lib/dal'


export const metadata: Metadata = {
    title: 'User Information',
    description: 'Enter your user information',
}

export default async function FormPage() {
    const { isAuth } = await verifySession()

    if (!isAuth) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">User Information</h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter your details below
                    </p>
                </div>
                <SEOForm />
            </div>
        </div>
    )
}