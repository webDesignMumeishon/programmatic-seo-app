'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const usernameSecret = process.env.USERNAME
const passwordSecret = process.env.PASSWORD

export async function Login(name: string, password: string) {
    if (name === usernameSecret && password === passwordSecret) {
        await createSession(name)
        return redirect('/form')
    }
    else {
        return { error: 'Wrong credentials' };
    }
}

export async function logout() {
    deleteSession()
    redirect('/login')
}