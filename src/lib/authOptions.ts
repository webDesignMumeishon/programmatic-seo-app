import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../lib/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultArgs } from '@prisma/client/runtime/library';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(prisma), // Prisma adapter for managing users
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email }
                })
                if (user !== null) {
                    return {
                        id: String(user.id),
                        email: user.email,
                    }
                } else {
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile?.email },
                    include: { accounts: true },
                });

                if (existingUser) {
                    // Link the account if it's not already linked
                    const isLinked = existingUser.accounts.some(
                        (acc) => acc.provider === account.provider
                    );

                    if (!isLinked) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id, // Link to the existing user
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                refresh_token: account.refresh_token,
                                expires_at: account.expires_at,
                                type: account.type,
                            },
                        });
                    }
                }
            }
            return true; // Allow sign-in
        },
        async jwt({ token, account }: any) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expires_at = account.expires_at;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;
            session.user.id = token.sub
            return session;
        },
    },
};
