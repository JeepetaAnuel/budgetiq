import type { Transaction, Budget, UserPreferences } from '../types'

export const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'EUR',
  period: 'monthly',
  monthlyIncome: 3000,
  aiPersonality: 'balanced',
}

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'income', category: 'salary', amount: 3000, description: 'Salario mensual', date: '2026-05-01' },
  { id: 't2', type: 'expense', category: 'housing', amount: 900, description: 'Alquiler mayo', date: '2026-05-03' },
  { id: 't3', type: 'expense', category: 'food', amount: 150, description: 'Supermercado semanal', date: '2026-05-05' },
  { id: 't4', type: 'expense', category: 'utilities', amount: 120, description: 'Electricidad + agua', date: '2026-05-06' },
  { id: 't5', type: 'expense', category: 'transport', amount: 60, description: 'Gasolina', date: '2026-05-08' },
  { id: 't6', type: 'expense', category: 'food', amount: 45, description: 'Cena restaurante', date: '2026-05-10' },
  { id: 't7', type: 'expense', category: 'entertainment', amount: 30, description: 'Netflix + Spotify', date: '2026-05-12' },
  { id: 't8', type: 'expense', category: 'shopping', amount: 200, description: 'Ropa y accesorios', date: '2026-05-15' },
  { id: 't9', type: 'expense', category: 'healthcare', amount: 80, description: 'Farmacia', date: '2026-05-18' },
  { id: 't10', type: 'expense', category: 'food', amount: 35, description: 'Cafetería', date: '2026-05-20' },
  { id: 't11', type: 'expense', category: 'education', amount: 50, description: 'Curso online', date: '2026-05-22' },
  { id: 't12', type: 'income', category: 'freelance', amount: 500, description: 'Proyecto freelance', date: '2026-05-25' },
]

export const SEED_BUDGETS: Budget[] = [
  { category: 'housing', limit: 1000, spent: 900 },
  { category: 'food', limit: 500, spent: 230 },
  { category: 'transport', limit: 200, spent: 60 },
  { category: 'utilities', limit: 200, spent: 120 },
  { category: 'healthcare', limit: 150, spent: 80 },
  { category: 'education', limit: 100, spent: 50 },
  { category: 'entertainment', limit: 150, spent: 30 },
  { category: 'shopping', limit: 300, spent: 200 },
  { category: 'travel', limit: 200, spent: 100 },
  { category: 'savings', limit: 600, spent: 300 },
]
