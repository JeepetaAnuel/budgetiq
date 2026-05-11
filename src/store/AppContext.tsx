import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, AppAction, Transaction, Budget, AIPlan, UserPreferences, BankConnection } from '../types'
import { DEFAULT_PREFERENCES, SEED_TRANSACTIONS, SEED_BUDGETS } from '../data/seed'
import { uid } from '../lib/utils'

const STORAGE = 'budgetiq-state'

function hydrate(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      return {
        transactions: parsed.transactions ?? SEED_TRANSACTIONS,
        budgets: parsed.budgets ?? SEED_BUDGETS,
        aiPlan: parsed.aiPlan ?? null,
        preferences: parsed.preferences ?? DEFAULT_PREFERENCES,
      }
    }
  } catch { /* empty */ }
  return {
    transactions: SEED_TRANSACTIONS,
    budgets: SEED_BUDGETS,
    aiPlan: null,
    preferences: DEFAULT_PREFERENCES,
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.transaction] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.id) }
    case 'SET_BUDGET': {
      const budgets = state.budgets.filter(b => b.category !== action.budget.category)
      return { ...state, budgets: [...budgets, action.budget] }
    }
    case 'SET_BUDGETS':
      return { ...state, budgets: action.budgets }
    case 'SET_AI_PLAN':
      return { ...state, aiPlan: action.plan }
    case 'SET_BANK':
      return { ...state, preferences: { ...state.preferences, bank: action.bank } }
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.preferences } }
    case 'LOAD_STATE':
      return action.state
    default:
      return state
  }
}

interface Ctx {
  state: AppState
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  setBudget: (budget: Budget) => void
  setBudgets: (budgets: Budget[]) => void
  setAIPlan: (plan: AIPlan | null) => void
  setBank: (bank: BankConnection | null) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  loadState: (state: AppState) => void
}

const ctx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, hydrate)

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)) } catch { /* empty */ }
  }, [state])

  const addTransaction = (data: Omit<Transaction, 'id'>) =>
    dispatch({ type: 'ADD_TRANSACTION', transaction: { ...data, id: uid() } })

  const deleteTransaction = (id: string) =>
    dispatch({ type: 'DELETE_TRANSACTION', id })

  const setBudget = (budget: Budget) =>
    dispatch({ type: 'SET_BUDGET', budget })

  const setBudgets = (budgets: Budget[]) =>
    dispatch({ type: 'SET_BUDGETS', budgets })

  const setAIPlan = (plan: AIPlan | null) =>
    dispatch({ type: 'SET_AI_PLAN', plan })

  const setBank = (bank: BankConnection | null) =>
    dispatch({ type: 'SET_BANK', bank })

  const updatePreferences = (preferences: Partial<UserPreferences>) =>
    dispatch({ type: 'UPDATE_PREFERENCES', preferences })

  const loadState = (s: AppState) =>
    dispatch({ type: 'LOAD_STATE', state: s })

  return (
    <ctx.Provider value={{ state, addTransaction, deleteTransaction, setBudget, setBudgets, setAIPlan, setBank, updatePreferences, loadState }}>
      {children}
    </ctx.Provider>
  )
}

export function useApp(): Ctx {
  const c = useContext(ctx)
  if (!c) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return c
}
