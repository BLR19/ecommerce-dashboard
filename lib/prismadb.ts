import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

//This is needed to avoid multiple instances of Prisma Client in development, because of the hot reloading of NextJS
const prismadb = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development') globalThis.prisma = prismadb

export default prismadb