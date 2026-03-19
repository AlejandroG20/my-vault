import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

// Extiende la configuración base con el proveedor Credentials (usa bcrypt y prisma — solo Node.js)
export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        // Proveedor de autenticación con email y contraseña
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // Verifica las credenciales y devuelve el usuario si son válidas
            async authorize(credentials) {
                // Rechaza si faltan campos
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Busca el usuario por email en la base de datos
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user) return null

                // Compara la contraseña recibida con el hash almacenado
                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!passwordMatch) return null

                // Devuelve los datos del usuario que se guardarán en el JWT
                return {
                    id: user.id,
                    email: user.email,
                }
            },
        }),
    ],
})