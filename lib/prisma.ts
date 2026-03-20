const { PrismaClient } = require("@prisma/client")

type PrismaClientType = InstanceType<typeof PrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

function createPrismaClient(): PrismaClientType {
  return new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const prisma: PrismaClientType = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}