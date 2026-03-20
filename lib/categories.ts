export const CATEGORIES = [
    "Vivienda",
    "Alimentación",
    "Transporte",
    "Ocio",
    "Salud",
    "Ropa",
    "Educación",
    "Suscripciones",
    "Restaurantes",
    "Bizum",
    "Otros",
] as const

export type Category = (typeof CATEGORIES)[number]