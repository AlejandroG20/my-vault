import "dotenv/config"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
    const email = "alejandro@gmail.com"
    const password = "Hershel6"

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
        },
    })

    console.log("Usuario creado:", user.email)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())