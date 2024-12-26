'use server'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '../../lib/prisma'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const usernameSecret = process.env.USERNAME
const passwordSecret = process.env.PASSWORD

export async function Login(name: string, password: string) {
    if (name === usernameSecret && password === passwordSecret) {
        cookies().set('session', name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return redirect('/form')
    }
    else {
        return { error: 'Wrong credentials' };
    }
}

export async function logout() {
    cookies().delete('session')
}

export async function signUp(email: string, password: string, name: string) {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('User already exists, please sign in');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                verificationToken,
            },
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationToken}`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Verify your account',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Please verify your account by clicking the link below:</p>
                <a href="${verificationUrl}">
                    Verify account
                </a>
            `,
        });

        return newUser;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Something went wrong, please try again.');
    }
}

export async function verifyEmail(token: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
            },
        });

        if (!user) {
            throw new Error('Invalid verification token or already used');
        }

        if (!user.verificationToken) {
            throw new Error('Account already verified');
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
            },
        });

        return { success: true, userName: user.name };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Verification failed. Please try again.');
    }
}

export async function createUserSession(userName: string) {
    cookies().set('session', userName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    return { success: true };
}