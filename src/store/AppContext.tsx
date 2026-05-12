import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, AppAction, Transaction, Budget, AIPlan, UserPreferences, BankConnection, SavingsGoal, ScannedTicket } from '../types'
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
        savingsGoals: parsed.savingsGoals ?? [],
        sharedGroups: parsed.sharedGroups ?? [],
        scannedTickets: parsed.scannedTickets ?? [],
      }
    }
  } catch { /* empty */ }
  return {
    transactions: SEED_TRANSACTIONS,
    budgets: SEED_BUDGETS,
    aiPlan: null,
    preferences: DEFAULT_PREFERENCES,
    savingsGoals: [],
    sharedGroups: [],
    scannedTickets: [],
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.transaction] }
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.id) }
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map(t => t.id === action.transaction.id ? action.transaction : t) }
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
    case 'ADD_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.goal] }
    case 'UPDATE_GOAL':
      return { ...state, savingsGoals: state.savingsGoals.map(g => g.id === action.goal.id ? action.goal : g) }
    case 'DELETE_GOAL':
      return { ...state, savingsGoals: state.savingsGoals.filter(g => g.id !== action.id) }
    case 'ADD_TICKET':
      return { ...state, scannedTickets: [...state.scannedTickets, action.ticket] }
    case 'DELETE_TICKET':
      return { ...state, scannedTickets: state.scannedTickets.filter(t => t.id !== action.id) }
    default:
      return state
  }
}

interface Ctx {
  state: AppState
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (transaction: Transaction) => void
  setBudget: (budget: Budget) => void
  setBudgets: (budgets: Budget[]) => void
  setAIPlan: (plan: AIPlan | null) => void
  setBank: (bank: BankConnection | null) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  loadState: (state: AppState) => void
  addGoal: (goal: SavingsGoal) => void
  updateGoal: (goal: SavingsGoal) => void
  deleteGoal: (id: string) => void
  addTicket: (ticket: ScannedTicket) => void
  deleteTicket: (id: string) => void
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

  const updateTransaction = (transaction: Transaction) =>
    dispatch({ type: 'UPDATE_TRANSACTION', transaction })

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

  const addGoal = (goal: SavingsGoal) =>
    dispatch({ type: 'ADD_GOAL', goal })

  const updateGoal = (goal: SavingsGoal) =>
    dispatch({ type: 'UPDATE_GOAL', goal })

  const deleteGoal = (id: string) =>
    dispatch({ type: 'DELETE_GOAL', id })

  const addTicket = (ticket: ScannedTicket) =>
    dispatch({ type: 'ADD_TICKET', ticket })

  const deleteTicket = (id: string) =>
    dispatch({ type: 'DELETE_TICKET', id })

  return (
    <ctx.Provider value={{ state, addTransaction, deleteTransaction, updateTransaction, setBudget, setBudgets, setAIPlan, setBank, updatePreferences, loadState, addGoal, updateGoal, deleteGoal, addTicket, deleteTicket }}>
      {children}
    </ctx.Provider>
  )
}

export function useApp(): Ctx {
  const c = useContext(ctx)
  if (!c) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return c
}
