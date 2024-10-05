'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, LogOut } from "lucide-react"
import { useSession, signIn, signOut } from 'next-auth/react';

export default function GoogleAuth() {
    const { data: session } = useSession()

    const handleSignIn = async () => {
        try {
            await signIn('google')
        } catch (error) {
            console.error('Failed to sign in:', error)
            // Fallback for when NextAuth is not available
            window.location.href = '/api/auth/signin'
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Failed to sign out:', error)
            // Fallback for when NextAuth is not available
            window.location.href = '/api/auth/signout'
        }
    }

    if (!session) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Card className="w-[350px] h-max">
                    <CardHeader>
                        <CardTitle>Connect Google Account</CardTitle>
                        <CardDescription>Access to Google Docs API requires authorization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-yellow-600">
                            <AlertCircle size={20} />
                            <p className="text-sm">You need to connect your Google account to proceed.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSignIn} className="w-full">
                            Connect Google Account
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <Card className="w-[350px] ">
                <CardHeader>
                    <CardTitle>Google Account Connected</CardTitle>
                    <CardDescription>You now have access to the Google Docs API</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">Signed in as: {session.user?.email}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleSignOut} variant="outline">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
