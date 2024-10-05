import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value
    const cookieGoogle = cookies().get('next-auth.session-token')?.value

    const session = await decrypt(cookie)

    if (!session?.userId) {
        return { isAuth: false, userId: null, hasToken: false }
    }

    if (cookieGoogle === undefined) {
        return { isAuth: true, userId: session?.userId, hasToken: false }
    }

    return { isAuth: true, userId: session?.userId, hasToken: true }
})