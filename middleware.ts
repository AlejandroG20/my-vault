import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

// Usa solo authConfig (sin bcrypt ni pg) para ser compatible con Edge runtime
const { auth } = NextAuth(authConfig)

// Middleware de protección de rutas — se ejecuta en cada petición
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")

  // Usuario no autenticado intentando acceder a una ruta protegida → redirige al login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Usuario ya autenticado intentando acceder al login → redirige al dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // En cualquier otro caso, deja pasar la petición
  return NextResponse.next()
})

// Aplica el middleware a todas las rutas excepto assets estáticos y favicon
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
