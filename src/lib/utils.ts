import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Currency } from '../types'

const CURRENCIES: Record<Currency, { symbol: string; locale: string }> = {
  EUR: { symbol: '€', locale: 'es-ES' },
  USD: { symbol: '$', locale: 'en-US' },
  GBP: { symbol: '£', locale: 'en-GB' },
  MXN: { symbol: 'MX$', locale: 'es-MX' },
}

export function fmt(amount: number, currency: Currency = 'EUR'): string {
  const c = CURRENCIES[currency]
  return `${c.symbol}${amount.toLocaleString(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function shortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMM', { locale: es })
}

export function longDate(dateStr: string): string {
  return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es })
}

export function progress(spent: number, limit: number): number {
  if (limit <= 0) return 0
  return Math.min((spent / limit) * 100, 100)
}

export function status(pct: number): 'safe' | 'warning' | 'danger' {
  if (pct >= 90) return 'danger'
  if (pct >= 70) return 'warning'
  return 'safe'
}

export function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
