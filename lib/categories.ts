import {
    ShoppingCart,
    Car,
    Gamepad2,
    Sword,
    Shirt,
    GraduationCap,
    UtensilsCrossed,
    Smartphone,
    MoreHorizontal,
    LucideIcon,
} from "lucide-react"

export const CATEGORIES = [
    "Compra",
    "Transporte",
    "Ocio",
    "Juegos",
    "Ropa",
    "Educación",
    "Restaurantes",
    "Bizum",
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
    Transporte: { icon: Car, color: "text-yellow-500", bg: "bg-yellow-50" },
    Ocio: { icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-50" },
    Juegos: { icon: Sword, color: "text-indigo-500", bg: "bg-indigo-50" },
    Ropa: { icon: Shirt, color: "text-pink-500", bg: "bg-pink-50" },
    Educación: { icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
    Restaurantes: { icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-50" },
    Bizum: { icon: Smartphone, color: "text-success-600", bg: "bg-success-50" },
    Otros: { icon: MoreHorizontal, color: "text-primary-400", bg: "bg-primary-50" },
}