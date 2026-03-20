import { DefaultSession } from "next-auth"

// Ampliamos los tipos de NextAuth para añadir el campo `id` al usuario de la sesión.
// Por defecto, next-auth no incluye el id en session.user, así que lo declaramos aquí
// para poder acceder a él con tipado correcto en todo el proyecto.
declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"] // Conservamos el resto de campos por defecto (name, email, image)
    }
}