import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { verifySession } from '@/lib/dal'
import Form from '@/components/Form'


export const metadata: Metadata = {
    title: 'User Information',
    description: 'Enter your user information',
}

export default async function FormPage() {
    const { isAuth } = await verifySession()

    if (!isAuth) {
        redirect('/login')
    }

    return (
        <Form />
    )
}