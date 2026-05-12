import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await signIn(email, password)
    setBusy(false)
    if (err) { setError(err); return }
    navigate('/dashboard')
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
          <h1 className="text-2xl font-extrabold text-slate-900">Bienvenido de nuevo</h1>
          <p className="text-sm text-slate-500 mt-1">Inicia sesión para continuar</p>
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
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all pr-11" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/20">
            {busy ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">o continúa con</span></div>
        </div>

        <button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238c-.36.31 6.591-4.807 6.591-14.807 0-1.341-.138-2.65-.389-3.917z"/></svg>
          Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿No tienes cuenta? <Link to="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
