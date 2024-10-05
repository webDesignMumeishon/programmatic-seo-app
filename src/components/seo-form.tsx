'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logout } from '@/actions/auth'
import { create } from '@/actions/content'
import KeywordInput from './atoms/KeywordInput'

const initialState = {
    city: '',
    service: ''
}

export default function SEOForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [cities, setCities] = useState<string[]>(['Seattle'])
    const [services, setServices] = useState<string[]>(['Traffic Ticket Lawyer'])
    const [data, setData] = useState(initialState)

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
        setIsLoading(true)
        await create(cities, services[0])
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
                <div className="space-y-2 flex-1">
                    <Label htmlFor="city">City</Label>
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
                            cities.map((city) => <KeywordInput keyword={city} remove={removeCity} />)
                        }
                    </div>
                </div>
                <div className="space-y-2 w-[50%]">
                    <Label htmlFor="service">Service</Label>
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
                            services.map((service) => <KeywordInput keyword={service} remove={removeService} />)
                        }
                    </div>
                </div>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">


                <h2>Company information</h2>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="Enter your website" type="url" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" placeholder="Enter your company name" disabled={isLoading} />
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

            <Button className="w-full bg-red-600 mt-4 hover:bg-red-400" type="submit" disabled={isLoading} onClick={() => logout()}>
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                Cancel
            </Button>
        </div>
    )
}