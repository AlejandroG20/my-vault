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
    "Otros",
] as const

export type Category = (typeof CATEGORIES)[number]