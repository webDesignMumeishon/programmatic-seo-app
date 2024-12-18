import 'server-only'
import { cache } from 'react'
import { getServerSession, } from 'next-auth/next'
import { authOptions } from './authOptions'

export const verifySession = cache(async () => {
    const nextAuthSession: any = await getServerSession(authOptions)

    if (nextAuthSession === null) {
        return { isAuth: false, userId: null, hasToken: false }
    }
    else {
        const accessToken = nextAuthSession.accessToken !== undefined

        if (accessToken) {
            return { isAuth: true, userId: nextAuthSession.user.id, hasToken: true }
        }
        return { isAuth: true, userId: nextAuthSession.user.id, hasToken: false }
    }

})