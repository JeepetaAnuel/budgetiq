export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
}

export interface Budget {
  category: string
  limit: number
  spent: number
}

export interface CategoryMeta {
  id: string
  name: string
  icon: string
  color: string
}

export interface AIAllocation {
  category: string
  amount: number
  percentage: number
  reasoning: string
}

export interface AIPlan {
  totalIncome: number
  allocations: AIAllocation[]
  savingsRecommendation: number
  savingsPercentage: number
  generatedAt: string
}

export type Currency = 'EUR' | 'USD' | 'GBP' | 'MXN'
export type Period = 'monthly' | 'yearly'
export type AIPersonality = 'balanced' | 'aggressive_savings' | 'flexible'

export interface BankConnection {
  bankId: string
  bankName: string
  accountNumber: string
  connectedAt: string
  lastSync: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  icon: string
}

export interface SharedGroup {
  id: string
  name: string
  members: string[]
  expenses: SharedExpense[]
}

export interface SharedExpense {
  id: string
  description: string
  amount: number
  paidBy: string
  date: string
  category: string
}

export interface ScannedTicket {
  id: string
  store: string
  date: string
  total: number
  items: { name: string; price: number }[]
  category: string
}

export interface CalendarSubscription {
  id: string
  name: string
  amount: number
  day: number
  category: string
}

export interface UserPreferences {
  currency: Currency
  period: Period
  monthlyIncome: number
  aiPersonality: AIPersonality
  bank?: BankConnection | null
}

export interface AppState {
  transactions: Transaction[]
  budgets: Budget[]
  aiPlan: AIPlan | null
  preferences: UserPreferences
  savingsGoals: SavingsGoal[]
  sharedGroups: SharedGroup[]
  scannedTickets: ScannedTicket[]
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; transaction: Transaction }
  | { type: 'DELETE_TRANSACTION'; id: string }
  | { type: 'UPDATE_TRANSACTION'; transaction: Transaction }
  | { type: 'SET_BUDGET'; budget: Budget }
  | { type: 'SET_BUDGETS'; budgets: Budget[] }
  | { type: 'SET_AI_PLAN'; plan: AIPlan | null }
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<UserPreferences> }
  | { type: 'SET_BANK'; bank: BankConnection | null }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'ADD_GOAL'; goal: SavingsGoal }
  | { type: 'UPDATE_GOAL'; goal: SavingsGoal }
  | { type: 'DELETE_GOAL'; id: string }
  | { type: 'ADD_TICKET'; ticket: ScannedTicket }
  | { type: 'DELETE_TICKET'; id: string }
