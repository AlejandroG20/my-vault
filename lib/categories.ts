import {
    ShoppingCart,
    Car,
    Gamepad2,
    Sword,
    BookOpen,
    Shirt,
    UtensilsCrossed,
    Banknote,
    Smartphone,
    RefreshCcw,
    MoreHorizontal,
    LucideIcon,
} from "lucide-react"

export const CATEGORIES = [
    "Compra",
    "Restaurantes",
    "Transporte",
    "Ocio",
    "Juegos",
    "Libros",
    "Ropa",
    "Suscripciones",
    "Bizum",
    "Efectivo",
    "Otros",
] as const

export type Category = (typeof CATEGORIES)[number]

interface CategoryConfig {
    icon: LucideIcon
    color: string
    bg: string
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    Compra: { icon: ShoppingCart, color: "text-green-500", bg: "bg-green-50" },
    Restaurantes: { icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-50" },
    Transporte: { icon: Car, color: "text-yellow-500", bg: "bg-yellow-50" },
    Ocio: { icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50" },
    Juegos: { icon: Sword, color: "text-indigo-500", bg: "bg-indigo-50" },
    Libros: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    Ropa: { icon: Shirt, color: "text-pink-500", bg: "bg-pink-50" },
    Suscripciones: { icon: RefreshCcw, color: "text-warning-600", bg: "bg-warning-50" },
    Bizum: { icon: Smartphone, color: "text-success-600", bg: "bg-success-50" },
    Efectivo: { icon: Banknote, color: "text-primary-500", bg: "bg-primary-50" },
    Otros: { icon: MoreHorizontal, color: "text-primary-400", bg: "bg-primary-50" },
}