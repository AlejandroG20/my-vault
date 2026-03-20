// En Prisma 7 el constructor no acepta opciones — la URL se pasa via variable de entorno
// La variable DATABASE_URL debe estar definida en .env (local) o en Vercel (producción)

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno")
}

process.env.PRISMA_DATABASE_URL = process.env.DATABASE_URL

const { PrismaClient } = require("@prisma/client")

type PrismaClientType = InstanceType<typeof PrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

function createPrismaClient(): PrismaClientType {
  return new PrismaClient()
}

export const prisma: PrismaClientType =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}