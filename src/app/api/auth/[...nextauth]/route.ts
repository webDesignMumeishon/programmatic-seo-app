import { authOptions } from '@/lib/authOptions';
import NextAuth from 'next-auth';

// Define the handler using the `authOptions`
const handler = NextAuth(authOptions);

// Export the handler for GET and POST methods
export { handler as GET, handler as POST };
