// Carga las variables de entorno del archivo .env (DATABASE_URL, etc.)
import "dotenv/config"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
    // Credenciales del usuario a crear — cámbialas antes de ejecutar
    const name = "Nombre"
    const email = "email"
    const password = "password"

    // Hasheamos la contraseña con bcrypt (12 rondas de sal)
    const hashed = await bcrypt.hash(password, 12)

    // Insertamos el usuario en la base de datos con la contraseña hasheada
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    })

    console.log("Usuario creado:", user.name, user.email)
}

// Ejecutamos el script y cerramos la conexión a la BD al terminar
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())