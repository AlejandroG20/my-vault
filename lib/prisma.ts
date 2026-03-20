import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// Crea el cliente Prisma con el adaptador de PostgreSQL apuntando a la base de datos
function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  // "as any" resuelve el conflicto estructural entre dos versiones de @types/pg
  const adapter = new PrismaPg(pool as any)
  const { PrismaClient } = require("@prisma/client")
  return new PrismaClient({ adapter })
}

// Inferimos el tipo desde la función en lugar de importarlo directamente
type PrismaClientType = ReturnType<typeof createPrismaClient>

// Guarda la instancia en globalThis para evitar múltiples conexiones en desarrollo
// (Next.js recarga módulos en hot-reload, esto previene agotar el pool de conexiones)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

// Reutiliza la instancia existente o crea una nueva
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// En desarrollo, persiste la instancia en global para sobrevivir hot-reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}