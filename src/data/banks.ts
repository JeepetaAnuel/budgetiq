export interface BankInfo {
  id: string
  name: string
  logo: string
  color: string
}

export const BANKS: BankInfo[] = [
  { id: 'bbva', name: 'BBVA', logo: 'landmark', color: '#004481' },
  { id: 'santander', name: 'Santander', logo: 'building', color: '#ec0000' },
  { id: 'caixabank', name: 'CaixaBank', logo: 'building-2', color: '#0073b7' },
  { id: 'ing', name: 'ING', logo: 'landmark', color: '#ff6600' },
  { id: 'sabadell', name: 'Sabadell', logo: 'building', color: '#dd1c1a' },
  { id: 'bankinter', name: 'Bankinter', logo: 'landmark', color: '#d42020' },
  { id: 'abanca', name: 'ABANCA', logo: 'building-2', color: '#009640' },
  { id: 'unicaja', name: 'Unicaja', logo: 'building', color: '#009150' },
  { id: 'kutxabank', name: 'KutxaBank', logo: 'building-2', color: '#004b87' },
  { id: 'openbank', name: 'Openbank', logo: 'landmark', color: '#003366' },
  { id: 'revolut', name: 'Revolut', logo: 'refresh-cw', color: '#1a1a1a' },
  { id: 'n26', name: 'N26', logo: 'refresh-cw', color: '#1a1a1a' },
]

export const MOCK_CREDENTIALS = [
  { bank: 'bbva', user: 'usuario001', pass: '********' },
  { bank: 'santander', user: 'cliente_01', pass: '********' },
]

export function generateBankTransactions(income: number) {
  const tx = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  for (let m = month - 2; m <= month; m++) {
    const d = new Date(year, m, Math.min(28, new Date(year, m + 1, 0).getDate()))
    tx.push({
      id: `bank-salary-${m}`,
      type: 'income' as const,
      category: 'salary',
      amount: income,
      description: 'Nómina mensual',
      date: d.toISOString().slice(0, 10),
    })
  }

  const expenses = [
    { cat: 'housing', desc: 'Recibo alquiler', min: 800, max: 1000 },
    { cat: 'food', desc: 'Supermercado', min: 80, max: 200 },
    { cat: 'utilities', desc: 'Luz', min: 50, max: 120 },
    { cat: 'transport', desc: 'Gasolina', min: 40, max: 80 },
    { cat: 'food', desc: 'Restaurante', min: 20, max: 60 },
    { cat: 'entertainment', desc: 'Suscripción digital', min: 10, max: 40 },
    { cat: 'shopping', desc: 'Compras online', min: 30, max: 150 },
    { cat: 'healthcare', desc: 'Farmacia', min: 15, max: 60 },
  ]

  for (let m = month - 2; m <= month; m++) {
    for (const e of expenses) {
      const day = Math.floor(Math.random() * 20) + 1
      const amount = Math.round((e.min + Math.random() * (e.max - e.min)) * 100) / 100
      tx.push({
        id: `bank-import-${m}-${e.cat}-${day}`,
        type: 'expense' as const,
        category: e.cat,
        amount,
        description: e.desc,
        date: new Date(year, m, day).toISOString().slice(0, 10),
      })
    }
  }

  return tx
}
