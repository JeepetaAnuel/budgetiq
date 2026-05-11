import type { CategoryMeta } from '../types'

export const CATEGORIES: CategoryMeta[] = [
  { id: 'housing', name: 'Vivienda', icon: 'home', color: '#6366f1' },
  { id: 'food', name: 'Alimentación', icon: 'utensils-crossed', color: '#f59e0b' },
  { id: 'transport', name: 'Transporte', icon: 'car', color: '#10b981' },
  { id: 'utilities', name: 'Servicios', icon: 'zap', color: '#ef4444' },
  { id: 'healthcare', name: 'Salud', icon: 'heart-pulse', color: '#ec4899' },
  { id: 'education', name: 'Educación', icon: 'graduation-cap', color: '#8b5cf6' },
  { id: 'entertainment', name: 'Entretenimiento', icon: 'gamepad-2', color: '#f97316' },
  { id: 'shopping', name: 'Compras', icon: 'shopping-bag', color: '#14b8a6' },
  { id: 'travel', name: 'Viajes', icon: 'plane', color: '#0ea5e9' },
  { id: 'savings', name: 'Ahorro', icon: 'piggy-bank', color: '#22c55e' },
  { id: 'other', name: 'Otros', icon: 'more-horizontal', color: '#64748b' },
]

export const INCOME_CATEGORIES: CategoryMeta[] = [
  { id: 'salary', name: 'Salario', icon: 'briefcase', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#0ea5e9' },
  { id: 'investment', name: 'Inversiones', icon: 'trending-up', color: '#8b5cf6' },
  { id: 'gift', name: 'Regalos', icon: 'gift', color: '#f97316' },
  { id: 'other-income', name: 'Otros', icon: 'plus', color: '#64748b' },
]

export function getCategory(id: string): CategoryMeta {
  return [...CATEGORIES, ...INCOME_CATEGORIES].find(c => c.id === id) ?? CATEGORIES[10]
}
