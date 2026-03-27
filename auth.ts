import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Usamos JWT en lugar de sesiones en BD para no necesitar la tabla Session
    session: {
        strategy: "jwt",
    },
    // Redirigimos a nuestra propia página de login en vez de la de NextAuth
    pages: {
        signIn: "/login",
    },
    callbacks: {
        // Al crear o renovar el token, guardamos el id del usuario dentro del JWT
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
            }
            return token
        },
        // Al construir la sesión, transferimos el id del token a session.user
        session({ session, token }) {
            if (token.id) session.user.id = token.id as string
            if (token.name) session.user.name = token.name as string
            return session
        },
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Rechazamos si faltan campos antes de consultar la BD
                if (!credentials?.email || !credentials?.password) return null

                // Buscamos el usuario por email en la base de datos
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                // Si no existe el usuario, denegamos acceso
                if (!user) return null

                // Comparamos la contraseña enviada con el hash almacenado
                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                // Si la contraseña no coincide, denegamos acceso
                if (!passwordMatch) return null

                // Devolvemos solo los campos necesarios para el token
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
        }),
    ],
})