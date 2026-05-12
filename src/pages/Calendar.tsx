import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CreditCard, TrendingUp, Sparkles, Circle } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { fmt } from '../lib/utils'
import { CATEGORIES } from '../data/categories'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

const SUBSCRIPTIONS = [
  { id: 's1', name: 'Netflix', amount: 15.99, day: 3, category: 'entertainment' },
  { id: 's2', name: 'Spotify', amount: 9.99, day: 5, category: 'entertainment' },
  { id: 's3', name: 'Basic-Fit', amount: 35.00, day: 10, category: 'healthcare' },
  { id: 's4', name: 'iCloud', amount: 6.99, day: 18, category: 'other' },
]

export default function Calendar() {
  const { state } = useApp()
  const { transactions, preferences } = state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const daysWithData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {}
    for (const t of transactions) {
      const key = t.date.slice(0, 10)
      if (!map[key]) map[key] = { income: 0, expense: 0 }
      if (t.type === 'income') map[key].income += t.amount
      else map[key].expense += t.amount
    }
    return map
  }, [transactions])

  const dayTransactions = useMemo(() => {
    if (!selectedDay) return []
    const key = format(selectedDay, 'yyyy-MM-dd')
    return transactions.filter(t => t.date.startsWith(key))
  }, [selectedDay, transactions])

  const projection = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const subsTotal = SUBSCRIPTIONS.reduce((s, sub) => s + sub.amount, 0)
    return income - expense - subsTotal
  }, [transactions])

  const daysWithoutExpense = useMemo(() =>
    days.filter(d => {
      const key = format(d, 'yyyy-MM-dd')
      return !daysWithData[key]?.expense
    }).length,
    [days, daysWithData]
  )

  const startDay = getDay(monthStart)
  const startOffset = startDay === 0 ? 6 : startDay - 1

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Calendario Financiero</h3>
        <p className="text-sm text-text-muted">Visualiza tus finanzas día a día</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={16} className="text-brand-400" /><span className="text-xs text-text-muted uppercase font-semibold">Proyección fin de mes</span></div>
          <p className="text-2xl font-bold" style={{ color: projection >= 0 ? '#10b981' : '#ef4444' }}>{fmt(projection, preferences.currency)}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><Sparkles size={16} className="text-warning" /><span className="text-xs text-text-muted uppercase font-semibold">Días sin gasto</span></div>
          <p className="text-2xl font-bold text-warning">{daysWithoutExpense}</p>
        </div>
        <div className="bg-surface-light border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1"><CreditCard size={16} className="text-danger" /><span className="text-xs text-text-muted uppercase font-semibold">Suscripciones activas</span></div>
          <p className="text-2xl font-bold text-danger">{SUBSCRIPTIONS.length} · {fmt(SUBSCRIPTIONS.reduce((s, sub) => s + sub.amount, 0), preferences.currency)}/mes</p>
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-surface-lighter/50 hover:bg-surface-lighter border border-border flex items-center justify-center transition-all">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-lg font-bold capitalize">{format(currentMonth, "MMMM yyyy", { locale: es })}</h3>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-xl bg-surface-lighter/50 hover:bg-surface-lighter border border-border flex items-center justify-center transition-all">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(d => {
            const key = format(d, 'yyyy-MM-dd')
            const data = daysWithData[key]
            const hasIncome = data?.income && data.income > 0
            const hasExpense = data?.expense && data.expense > 0
            const isSelected = selectedDay && isSameDay(d, selectedDay)
            const isToday = isSameDay(d, new Date())

            let bg = ''
            if (isSelected) bg = 'ring-2 ring-brand-500 bg-brand-500/10'
            else if (hasIncome && !hasExpense) bg = 'bg-success/10 text-success'
            else if (hasExpense && !hasIncome) bg = 'bg-danger/10 text-danger'
            else if (hasIncome && hasExpense) bg = 'bg-warning/10 text-warning'
            else if (isToday) bg = 'bg-surface-lighter'

            return (
              <button key={key} onClick={() => setSelectedDay(d)}
                className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center hover:bg-surface-lighter/50 transition-all ${bg}`}>
                {format(d, 'd')}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center"><CreditCard size={20} className="text-danger" /></div>
            <div><h4 className="font-semibold">Suscripciones</h4><p className="text-xs text-text-muted">Próximos pagos recurrentes</p></div>
          </div>
          <div className="space-y-2">
            {SUBSCRIPTIONS.map(sub => {
              const cat = CATEGORIES.find(c => c.id === sub.category)
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-surface-lighter/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color ?? '#64748b' }} />
                    <span className="text-sm font-medium">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">Día {sub.day}</span>
                    <span className="text-sm font-semibold text-danger">{fmt(sub.amount, preferences.currency)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-surface-light border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center"><Circle size={20} className="text-brand-400" /></div>
            <div>
              <h4 className="font-semibold">{selectedDay ? format(selectedDay, "d 'de' MMMM", { locale: es }) : 'Selecciona un día'}</h4>
              <p className="text-xs text-text-muted">{selectedDay ? 'Transacciones de este día' : 'Haz clic en un día del calendario'}</p>
            </div>
          </div>
          {selectedDay && dayTransactions.length === 0 && (
            <p className="text-sm text-text-muted text-center py-6">No hay transacciones en este día.</p>
          )}
          {dayTransactions.length > 0 && (
            <div className="divide-y divide-border">
              {dayTransactions.map(t => {
                const cat = CATEGORIES.find(c => c.id === t.category)
                return (
                  <div key={t.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color ?? '#64748b' }} />
                      <div>
                        <p className="text-sm font-medium">{cat?.name ?? t.category}</p>
                        <p className="text-xs text-text-muted">{t.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount, preferences.currency)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}