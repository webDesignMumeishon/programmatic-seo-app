import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import prisma from '../lib/prisma'

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token
        if (req.nextUrl.pathname === '/login' && token) {
            return NextResponse.redirect(new URL('/form', req.url))
        }
        return NextResponse.next()
    },
    {
        pages: {
            signIn: '/login',
        },
    }
)

export const config = {
    matcher: ['/login', '/form'], // Protect login and other specific routes
}
