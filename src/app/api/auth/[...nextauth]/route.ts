import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    secret: process.env.SESSION_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/documents',
                    access_type: 'offline',  // This requests the refresh token
                    prompt: 'consent', // Forces Google to show the consent screen (needed for refresh token)
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }: any) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;  // Store the refresh token
                token.expires_at = account.expires_at; // Store expiration time
            }

            // If access token has expired, use refresh token to get a new one
            // if (Date.now() < token.expires_at) {
            //     return token; // Still valid
            // }

            return token

            // // Refresh the access token
            // try {
            //     const url = 'https://oauth2.googleapis.com/token';
            //     const response = await fetch(url, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: new URLSearchParams({
            //             client_id: process.env.GOOGLE_CLIENT_ID,
            //             client_secret: process.env.GOOGLE_CLIENT_SECRET,
            //             refresh_token: token.refreshToken, // Use the stored refresh token
            //             grant_type: 'refresh_token',
            //         }),
            //     });

            //     const refreshedTokens = await response.json();

            //     // Update token with new access token and expiry date
            // return {
            //     ...token,
            //     accessToken: refreshedTokens.access_token,
            //     expires_at: Date.now() + refreshedTokens.expires_in * 1000, // New expiry date
            //     refreshToken: refreshedTokens.refresh_token || token.refreshToken, // Refresh token might not be sent again
            // };
            // } catch (error) {
            //     console.error('Failed to refresh access token:', error);
            //     return { ...token, error: 'RefreshAccessTokenError' };
            // }
        },

        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;  // Pass the refresh token to the session
            session.error = token.error;

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // Handle GET and POST requests
