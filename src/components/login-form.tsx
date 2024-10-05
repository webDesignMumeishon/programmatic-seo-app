'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Login } from '@/actions/auth'
import Link from 'next/link'

export default function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        const target = event.target as typeof event.target & {
            username: { value: string }
            password: { value: string }
        }
        const username = target.username.value
        const password = target.password.value
        try {
            const response = await Login(username, password)
            if (response?.error) {
                throw new Error(response.error)
            }
            router.push('/form')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    async function onSignUp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        // Implement sign-up logic here
        // For now, we'll just simulate a delay and show a success message
        setTimeout(() => {
            setIsLoading(false)
            alert('Sign up successful! Please log in.')
        }, 1500)
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Login or create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={onLogin} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-username">Username</Label>
                                <Input id="login-username" name="username" placeholder="Enter your username" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" name="password" type="password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form onSubmit={onSignUp} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-username">Username</Label>
                                <Input id="signup-username" name="username" placeholder="Choose a username" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" name="email" placeholder="Enter your email" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" name="password" type="password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <CardFooter className="flex justify-center">
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                    Forgot password?
                </Link>
            </CardFooter>
        </Card>
    )
}