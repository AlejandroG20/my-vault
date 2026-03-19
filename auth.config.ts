import type { NextAuthConfig } from "next-auth"

// Configuración base de NextAuth — sin imports de Node.js para ser compatible con Edge runtime.
// El middleware usa este archivo directamente; auth.ts añade la lógica completa (bcrypt, prisma).
export const authConfig = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    // Los providers con dependencias Node.js se declaran en auth.ts
    providers: [],
} satisfies NextAuthConfig
