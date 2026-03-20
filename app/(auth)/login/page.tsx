import { signIn } from "@/auth";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Leemos los parámetros de la URL para detectar si hubo un error previo
  const params = await searchParams;
  const hasError = params.error === "invalid";

  // Server Action: se ejecuta en el servidor al enviar el formulario
  async function handleLogin(formData: FormData) {
    "use server";

    // Extraemos los campos del formulario
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Intentamos autenticar con las credenciales y redirigir al dashboard
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
      });
    } catch (error) {
      // Si falla, redirigimos con un query param para mostrar el error
      redirect("/login?error=invalid");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm px-4 sm:px-0">
        {/* Header fuera del card */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-600 mb-4 shadow-lg shadow-accent-200">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold font-heading text-primary-900">My Vault</h1>
          <p className="text-sm text-primary-400 mt-1">Accede a tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-primary-100 border border-primary-100 p-8">
          {hasError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-danger-50 border border-danger-100 px-4 py-3">
              <svg
                className="w-4 h-4 text-danger-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              <p className="text-sm text-danger-600">
                Email o contraseña incorrectos
              </p>
            </div>
          )}

          <form action={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-primary-600 uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:bg-white focus:ring-3 focus:ring-accent-100 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-primary-600 uppercase tracking-wide"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:bg-white focus:ring-3 focus:ring-accent-100 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-accent-600 text-white py-2.5 text-sm font-semibold hover:bg-accent-700 active:scale-[0.98] transition-all mt-1 shadow-md shadow-accent-200"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
