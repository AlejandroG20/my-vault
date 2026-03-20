export type TransactionType = "INCOME" | "EXPENSE"

export interface TransactionItem {
    id: string
    amount: number
    type: TransactionType
    category: string
    description: string | null
    date: Date
    userId: string
    createdAt: Date
}

export interface SubscriptionItem {
    id: string
    name: string
    amount: number
    dayOfMonth: number
    category: string
    active: boolean
    lastCharged: Date | null
    userId: string
    createdAt: Date
}

export interface GoalItem {
    id: string
    name: string
    amount: number
    userId: string
    createdAt: Date
}