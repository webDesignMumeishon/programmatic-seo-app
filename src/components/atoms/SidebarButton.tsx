import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

type Props = {
    pathname: string
    page: string
    currentPath: string
}

const SidebarButton = ({ pathname, page, currentPath }: Props) => {
    return (
        <>
            <Button
                variant={currentPath === pathname ? 'default' : 'ghost'}
                className="w-full justify-start"
                asChild
            >
                <Link href={pathname}>{page}</Link>
            </Button>
        </>

    )
}

export default SidebarButton