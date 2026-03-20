import path from "node:path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter(env: Record<string, string | undefined>) {
      const { PrismaPg } = await import("@prisma/adapter-pg")
      return new PrismaPg({ connectionString: env.DATABASE_URL })
    },
  },
})
