import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setError('')
    setBusy(true)
    const { error: err } = await signUp(email, password)
    setBusy(false)
    if (err) { setError(err); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Cuenta creada</h1>
          <p className="text-sm text-slate-500 mb-6">Te enviamos un correo de confirmación. Revisa tu bandeja de entrada.</p>
          <Link to="/login" className="inline-flex px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-emerald-600 transition-all">Ir a iniciar sesión</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-slate-900 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
              <Sparkles size={16} />
            </div>
            Budget<span className="text-emerald-600">IQ</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Crear cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Empieza a optimizar tu dinero</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all" />
          </div>

          <button type="submit" disabled={busy} className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/20">
            {busy ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
