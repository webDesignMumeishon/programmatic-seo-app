'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Login } from '@/actions/auth'

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        const target = event.target as typeof event.target & {
            username: { value: string }
            password: { value: string }
        }
        const username = target.username.value
        const password = target.password.value
        try {
            const response = await Login(username, password)
            if (response?.error) {
                throw new Error(response?.error)
            }
        } catch (error) {
            alert(error)
            target.username.value = ''
            target.password.value = ''
            setIsLoading(false)
        }

    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="username" placeholder="Enter your name" type="text" disabled={isLoading} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" disabled={isLoading} required />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                Sign In
            </Button>
        </form>
    )
}