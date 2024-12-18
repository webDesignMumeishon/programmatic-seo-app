'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import prisma from '../../lib/prisma'

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
}

// export async function signUp(email: string, password: string, name: string) {
//     try {
//         const createdUser = await prisma.user.create({
//             data: {
//                 email,
//                 password,
//                 name
//             }
//         })
//         return createdUser.email
//     } catch (error) {
//         return null
//     }

// }