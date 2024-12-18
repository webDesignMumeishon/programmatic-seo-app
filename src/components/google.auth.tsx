'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"

export default function PlatformSelectionPage() {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (selectedPlatform) {
            // Here you would typically save the selected platform to the user's profile
            console.log(`Selected platform: ${selectedPlatform}`)
            router.push('/dashboard') // Redirect to dashboard or next step
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Select a Platform</CardTitle>
                    <CardDescription>Choose a platform to connect to your account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <RadioGroup value={selectedPlatform || ""} onValueChange={setSelectedPlatform} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="google-docs" id="google-docs" />
                                <Label htmlFor="google-docs" className="flex items-center space-x-2 cursor-pointer">
                                    <Icons.google className="h-5 w-5" />
                                    <span>Google Docs</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 opacity-50">
                                <RadioGroupItem value="wordpress" id="wordpress" disabled />
                                <Label htmlFor="wordpress" className="flex items-center space-x-2 cursor-not-allowed">
                                    <Icons.wordpress className="h-5 w-5" />
                                    <span>WordPress</span>
                                    <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={!selectedPlatform}>
                            Connect Platform
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

