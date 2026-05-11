import type { Currency } from '../types'

export interface CurrencyOption {
  value: Currency
  label: string
  symbol: string
}

export const CURRENCIES: CurrencyOption[] = [
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'USD', label: 'Dólar', symbol: '$' },
  { value: 'GBP', label: 'Libra', symbol: '£' },
  { value: 'MXN', label: 'Peso Mexicano', symbol: 'MX$' },
]
