'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createJobs } from '@/actions/content'
import KeywordInput from './atoms/KeywordInput'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleHelp } from 'lucide-react';

const initialState = {
    city: '',
    service: ''
}

export default function SEOForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [cities, setCities] = useState<string[]>([])

    const [services, setServices] = useState<string[]>([])
    const [data, setData] = useState(initialState)
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')

    const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
        const name = event.currentTarget.name
        const value = event.currentTarget.value
        setData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const addCity = () => {
        if (data.city.length > 0) {
            setCities(prevCities => ([
                ...prevCities,
                data.city
            ]))
        }
        setData({
            service: data.service,
            city: ''
        })
    }

    const removeCity = (city: string) => {
        const filtered = cities.filter(c => c !== city)
        setCities(filtered)
    }

    const addService = () => {
        if (data.service.length > 0) {
            setServices(prevServices => ([
                ...prevServices,
                data.service
            ]))
        }
        setData({
            city: data.city,
            service: ''
        })
    }

    const removeService = (service: string) => {
        const filtered = services.filter(s => s !== service)
        setServices(filtered)
    }

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        if (cities.length === 0 || services.length === 0 || phone.length === 0) {
            return alert('Missing cities or services')
        }
        setIsLoading(true)
        await createJobs(cities, services, website, company, phone)
        setIsLoading(false)
    }

    if (isLoading) {
        return <h1>Loading</h1>
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission on Enter
        }
    };
    return (
        <div>
            <h2>Keywords</h2>

            <div className='flex gap-6'>
                <div className="space-y-2 flex-1 items-center">
                    <div className='flex gap-2'>
                        <Label htmlFor="city">City</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleHelp size={'16'} className='cursor-pointer' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Press enter to add</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className='flex gap-1'>
                        <Input
                            name="city"
                            id="city"
                            placeholder="Enter your city"
                            disabled={isLoading}
                            value={data.city}
                            onChange={handleOnChange}
                            onKeyDown={(e) => e.key === 'Enter' && addCity()}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap'>
                        {
                            cities.map((city) => <KeywordInput key={city} keyword={city} remove={removeCity} />)
                        }
                    </div>
                </div>
                <div className="space-y-2 w-[50%]">
                    <div className='flex gap-2'>
                        <Label htmlFor="service">Service</Label>
                        <TooltipProvider >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleHelp size={'16'} className='cursor-pointer' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Press enter to add</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className='flex gap-1'>
                        <Input
                            name="service"
                            id="service"
                            placeholder="Enter your service"
                            disabled={isLoading}
                            value={data.service}
                            onChange={handleOnChange}
                            onKeyDown={(e) => e.key === 'Enter' && addService()}
                        />
                    </div>

                    <div className='flex gap-2 flex-wrap'>

                        {
                            services.map((service) => <KeywordInput key={service} keyword={service} remove={removeService} />)
                        }
                    </div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">

                <h2>Company information</h2>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="Enter your website" type="url" disabled={isLoading} onChange={(e) => setWebsite(e.target.value)} value={website} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" placeholder="Enter your company name" disabled={isLoading} onChange={(e) => setCompany(e.target.value)} value={company} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter your company phone" disabled={isLoading} onChange={(e) => setPhone(e.target.value)} value={phone} />
                </div>

                <Button className="w-full" type="submit" disabled={isLoading} onKeyDown={handleKeyDown}>
                    {isLoading && (
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    Submit
                </Button>
            </form>
        </div>
    )
}