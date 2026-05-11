import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Modal from '../ui/Modal'
import Icon from '../ui/Icon'
import { BANKS, generateBankTransactions } from '../../data/banks'
import { useApp } from '../../store/AppContext'
import type { BankConnection } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
}

type Step = 'select' | 'credentials' | 'connecting' | 'done' | 'error'

export default function BankConnector({ open, onClose }: Props) {
  const { state, setBank, addTransaction, updatePreferences } = useApp()
  const [step, setStep] = useState<Step>('select')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [accountNum, setAccountNum] = useState('')

  function reset() {
    setStep('select')
    setSelectedBank(null)
    setUsername('')
    setPassword('')
    setAccountNum('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function selectBank(id: string) {
    setSelectedBank(id)
    const mock = id === 'bbva' || id === 'santander'
    if (mock) {
      setUsername(`cliente_${id}`)
      setPassword('********')
    } else {
      setUsername('')
      setPassword('')
    }
    setAccountNum(`ES${Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('')}`)
    setStep('credentials')
  }

  function handleConnect() {
    setStep('connecting')
    setTimeout(() => {
      try {
        const bank = BANKS.find(b => b.id === selectedBank)
        if (!bank) { setStep('error'); return }

        const income = state.preferences.monthlyIncome || 2800
        const imported = generateBankTransactions(income)

        for (const tx of imported) {
          addTransaction(tx)
        }

        const connection: BankConnection = {
          bankId: bank.id,
          bankName: bank.name,
          accountNumber: accountNum,
          connectedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
        }
        setBank(connection)

        const salaryTx = imported.filter(t => t.category === 'salary')
        if (salaryTx.length > 0) {
          const avgSalary = Math.round(salaryTx.reduce((s, t) => s + t.amount, 0) / salaryTx.length)
          updatePreferences({ monthlyIncome: avgSalary })
        }

        setStep('done')
      } catch {
        setStep('error')
      }
    }, 2500)
  }

  const bankName = selectedBank ? BANKS.find(b => b.id === selectedBank)?.name : ''

  return (
    <Modal open={open} onClose={handleClose} title="Conectar Banco">
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-text-muted">Selecciona tu banco para conectar de forma segura:</p>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {BANKS.map(b => (
                  <button key={b.id} onClick={() => selectBank(b.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-brand-500/40 bg-surface-lighter/20 hover:bg-surface-lighter/50 transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${b.color}20` }}>
                      <Icon name={b.logo} size={16} style={{ color: b.color }} />
                    </div>
                    <span className="text-sm font-medium">{b.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted text-center pt-2">Conexión simulada con cifrado de extremo a extremo</p>
            </motion.div>
          )}

          {step === 'credentials' && selectedBank && (
            <motion.div key="credentials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BANKS.find(b => b.id === selectedBank)?.color}20` }}>
                  <Icon name={BANKS.find(b => b.id === selectedBank)?.logo ?? 'building'} size={20} style={{ color: BANKS.find(b => b.id === selectedBank)?.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{bankName}</p>
                  <p className="text-xs text-text-muted">Conexión segura · TLS 1.3</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Usuario / Identificador</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50" placeholder="ej: usuario001" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface text-white border border-border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-brand-500/50" placeholder="••••••••" />
                  <button onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-surface-lighter/30 rounded-xl p-3 text-xs text-text-muted space-y-1">
                <p className="flex items-center gap-2"><AlertCircle size={12} /> Tus credenciales no se almacenan</p>
                <p className="flex items-center gap-2"><AlertCircle size={12} /> Usamos token de acceso de solo lectura</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('select')} className="flex-1 px-4 py-3 text-sm font-medium text-text-muted hover:text-white bg-surface-lighter/50 border border-border rounded-xl">Atrás</button>
                <button onClick={handleConnect} disabled={!username || !password} className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-50 rounded-xl shadow-lg shadow-brand-500/20">Conectar</button>
              </div>
            </motion.div>
          )}

          {step === 'connecting' && (
            <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                <Loader size={32} className="text-brand-400 animate-spin" />
              </div>
              <p className="text-base font-semibold mb-1">Conectando con {bankName}...</p>
              <p className="text-sm text-text-muted text-center">Estableciendo conexión segura e importando transacciones</p>
              <div className="mt-6 w-full max-w-xs bg-surface-lighter rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'easeInOut' }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400" />
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-5">
                <CheckCircle size={32} className="text-success" />
              </div>
              <p className="text-base font-semibold mb-1">¡Banco conectado!</p>
              <p className="text-sm text-text-muted text-center max-w-xs">
                {bankName} se ha conectado correctamente. Tus transacciones se han importado y la IA ha detectado tu nómina.
              </p>
              <div className="mt-4 bg-surface-lighter/30 rounded-xl p-3 w-full text-xs text-text-muted">
                <p className="flex items-center justify-between"><span>Cuenta:</span><span className="font-medium text-text-primary">{accountNum.slice(0, 4)} **** **** {accountNum.slice(-4)}</span></p>
                <p className="flex items-center justify-between mt-1"><span>Última sincronización:</span><span className="font-medium text-text-primary">Ahora</span></p>
              </div>
              <button onClick={handleClose} className="mt-6 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/20">Ir al Panel</button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-5">
                <AlertCircle size={32} className="text-danger" />
              </div>
              <p className="text-base font-semibold mb-1">Error de conexión</p>
              <p className="text-sm text-text-muted text-center max-w-xs">No se ha podido conectar con el banco. Verifica tus credenciales e inténtalo de nuevo.</p>
              <button onClick={() => setStep('select')} className="mt-6 px-6 py-3 bg-surface-lighter/50 hover:bg-surface-lighter text-sm font-medium border border-border rounded-xl">Reintentar</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
