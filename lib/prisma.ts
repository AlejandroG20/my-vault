const { PrismaClient } = require("@prisma/client")

type PrismaClientType = InstanceType<typeof PrismaClient>

// Guarda la instancia en globalThis para evitar múltiples conexiones en desarrollo
// (Next.js recarga módulos en hot-reload, esto previene agotar el pool de conexiones)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

// Crea el cliente sin opciones — la URL la lee del .env a través de prisma.config.ts
function createPrismaClient(): PrismaClientType {
  return new PrismaClient()
}

// Reutiliza la instancia existente o crea una nueva
export const prisma: PrismaClientType = globalForPrisma.prisma ?? createPrismaClient()

// En desarrollo, persiste la instancia en global para sobrevivir hot-reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}