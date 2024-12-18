'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import { signUp } from '@/actions/auth'

export default function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>, mode: 'login' | 'signup') {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string

        if (mode === 'login') {
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                })

                if (result?.error) {
                    setError(result.error)
                } else {
                    router.push('/form')
                }
            } catch (error) {
                setError('An unexpected error occurred')
            }
        } else {
            try {
                const user = await signUp(email, password, name)
                if (user !== null) {
                    router.push('/login')
                } else {
                    setError('Failed to create user')
                }
            } catch (error) {
                setError('An unexpected error occurred')
            }
        }

        setIsLoading(false)
    }

    const handleGoogleSignIn = () => {
        setIsLoading(true)
        signIn('google', { callbackUrl: '/form' })
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
                        <form onSubmit={(e) => onSubmit(e, 'login')} className="space-y-4 mt-4">

                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" name="email" placeholder="Enter your email" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" name="password" type="password" placeholder="Enter your password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form onSubmit={(e) => onSubmit(e, 'signup')} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-name">Name</Label>
                                <Input id="login-name" placeholder="Enter your name" name="name" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" name="email" placeholder="Enter your email" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" name="password" type="password" placeholder="Enter your password" required />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
                <div className="relative mt-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={handleGoogleSignIn}
                        className="w-full"
                    >
                        {isLoading ? 'Processing...' : 'Sign in with Google'}
                    </Button>
                </div>
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

