'use client'
import React from 'react'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logout } from '@/actions/auth'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SidebarButton from './atoms/SidebarButton'

const Sidebar = () => {
    const currentPath = usePathname()
    const [isLoading, setIsLoading] = useState(false)
    const [cities, setCities] = useState<string[]>(['Seattle'])
    const [services, setServices] = useState<string[]>(['Traffic Ticket Lawyer'])
    const [activeTab, setActiveTab] = useState('dashboard')

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar for larger screens */}
            <aside className="hidden md:flex w-64 flex-col bg-card">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">SEO Dashboard</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <SidebarButton page={"Generate"} pathname={'/form'} currentPath={currentPath} />
                    <SidebarButton page={"Settings"} pathname={'settings'} currentPath={currentPath} />
                </nav>
                <div className="p-4">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => logout()}
                        disabled={isLoading}
                    >
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Mobile sidebar */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4">
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="flex flex-col h-full bg-card">
                        <div className="p-4">
                            <h1 className="text-2xl font-bold">SEO Dashboard</h1>
                        </div>
                        <nav className="flex-1 px-2 py-4 space-y-2">
                            <Button
                                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant={activeTab === 'generate' ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveTab('generate')}
                            >
                                Generate
                            </Button>
                        </nav>
                        <div className="p-4">
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => logout()}
                                disabled={isLoading}
                            >
                                Log Out
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div >
    )
}

export default Sidebar