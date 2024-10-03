import SEOForm from '@/components/seo-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User Information',
    description: 'Enter your user information',
}

export default function FormPage() {
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