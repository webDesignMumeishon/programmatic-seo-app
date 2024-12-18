'use server'
import bcrypt from 'bcrypt'
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

export async function signUp(email: string, password: string, name: string) {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('User already exists, please sign in')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return newUser
    } catch (error) {
        throw new Error('Something went wrong, please try again.')
    }

}