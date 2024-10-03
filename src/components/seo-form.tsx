'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logout } from '@/actions/auth'

export default function SEOForm() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        const target = event.target as typeof event.target & {
            city: { value: string }
            service: { value: string }
            website: { value: string }
            companyName: { value: string }
        }

        const formData = {
            city: target.city.value,
            service: target.service.value,
            website: target.website.value,
            companyName: target.companyName.value,
        }

        // Here you would typically send the form data to your server
        console.log(formData)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsLoading(false)
        // Here you might want to redirect the user or show a success message
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Enter your city" disabled={isLoading} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input id="service" placeholder="Enter your service" disabled={isLoading} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="Enter your website" type="url" disabled={isLoading} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Enter your company name" disabled={isLoading} required />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                Submit
            </Button>
            <Button className="w-full bg-red-600" type="submit" disabled={isLoading} onClick={() => logout()}>
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                Cancel
            </Button>
        </form>
    )
}