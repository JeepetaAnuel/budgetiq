import type { AIPlan, AIAllocation, Transaction, Budget, AIPersonality } from '../types'
import { CATEGORIES } from '../data/categories'

function getLabel(id: string): string {
  return CATEGORIES.find(c => c.id === id)?.name ?? id
}

function buildWeights(transactions: Transaction[], budgets: Budget[], income: number, personality: AIPersonality): Record<string, number> {

  const spent: Record<string, number> = {}
  for (const t of transactions) {
    if (t.type === 'expense') spent[t.category] = (spent[t.category] ?? 0) + t.amount
  }

  const w: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    const id = cat.id
    const s = spent[id] ?? 0
    const b = budgets.find(b => b.category === id)
    const limit = b?.limit ?? 0

    let weight = s > 0 ? s / income : limit > 0 ? limit / income : 0.05

    if (id === 'housing') weight = Math.max(weight, 0.28)
    if (id === 'food') weight = Math.max(weight, 0.12)
    if (id === 'savings') weight = personality === 'aggressive_savings' ? 0.22 : 0.10

    if (personality === 'aggressive_savings') {
      if (['entertainment', 'shopping', 'travel'].includes(id)) weight *= 0.5
    }
    if (personality === 'flexible') {
      if (['entertainment', 'shopping'].includes(id)) weight *= 1.3
    }

    w[id] = Math.max(0.01, Math.min(weight, 0.45))
  }

  const total = Object.values(w).reduce((s, v) => s + v, 0)
  for (const k of Object.keys(w)) w[k] /= total

  return w
}

function getReasoning(id: string, pct: number, personality: AIPersonality): string {
  const name = getLabel(id).toLowerCase()

  if (id === 'savings') {
    if (personality === 'aggressive_savings') return `Ahorro prioritario al ${pct}%. Estrategia agresiva de acumulación.`
    if (pct >= 18) return `${pct}% destinado a ahorro. Regla 50/30/20 optimizada.`
    return `${pct}% para ahorro e inversión.`
  }
  if (id === 'housing') return `Máximo ${pct}% para vivienda. Por debajo del 35% recomendado.`
  if (id === 'food') return `${pct}% para alimentación. Basado en consumo histórico.`
  if (id === 'entertainment') return `${pct}% para ocio. Rango saludable 5-10%.`

  if (['shopping', 'travel'].includes(id) && personality === 'aggressive_savings') {
    return `${pct}% para ${name}. Reducido por estrategia de ahorro.`
  }
  return `${pct}% para ${name}. Según perfil de gasto.`
}

export function generatePlan(
  transactions: Transaction[],
  budgets: Budget[],
  income: number,
  personality: AIPersonality,
): AIPlan {

  const weights = buildWeights(transactions, budgets, income, personality)

  const essential = ['housing', 'food', 'transport', 'utilities', 'healthcare']
  const essentialTotal = essential.reduce((s, c) => s + (weights[c] ?? 0), 0)

  let savingsPct = personality === 'aggressive_savings' ? 0.25 : personality === 'flexible' ? 0.08 : 0.12
  const remaining = 1 - essentialTotal - savingsPct

  const allocations: AIAllocation[] = []

  for (const cat of CATEGORIES) {
    const id = cat.id
    let pct: number

    if (id === 'savings') {
      pct = savingsPct
    } else if (essential.includes(id)) {
      pct = (weights[id] ?? 0.05) * (1 - savingsPct)
    } else {
      const nonEssential = CATEGORIES.filter(c => !essential.includes(c.id) && c.id !== 'savings')
      const totalOther = nonEssential.reduce((s, c) => s + (weights[c.id] ?? 0.01), 0)
      pct = ((weights[id] ?? 0.01) / totalOther) * remaining
    }

    const amount = income * pct
    allocations.push({
      category: id,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(pct * 10000) / 100,
      reasoning: getReasoning(id, Math.round(pct * 10000) / 100, personality),
    })
  }

  const savings = allocations.find(a => a.category === 'savings')!

  return {
    totalIncome: income,
    allocations,
    savingsRecommendation: savings.amount,
    savingsPercentage: savings.percentage,
    generatedAt: new Date().toISOString(),
  }
}
