import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined; // Add type for global prisma instance
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma; // Attach Prisma client to global scope in dev mode
}

export default prisma;
