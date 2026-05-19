import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, BarChart3, CheckCircle, ArrowRight, Menu, X, LogIn } from 'lucide-react'

const CATEGORIES = [
  { emoji: '🏠', name: 'Vivienda', desc: 'Alquiler, hipoteca', tag: 'Fija · €950' },
  { emoji: '🛒', name: 'Alimentación', desc: 'Supermercado, delivery', tag: 'Variable · €600' },
  { emoji: '💰', name: 'Ahorro', desc: 'Fondo de emergencia', tag: 'Ahorro · €500' },
  { emoji: '🎮', name: 'Ocio', desc: 'Entretenimiento, viajes', tag: 'Variable · €300' },
  { emoji: '🚗', name: 'Transporte', desc: 'Gasolina, transporte público', tag: 'Variable · €200' },
  { emoji: '🏥', name: 'Salud', desc: 'Seguros, farmacia', tag: 'Fija · €200' },
]

const FEATURES = [
  { step: '1', title: 'Conecta tus cuentas', desc: 'Vincula tus cuentas o introduce manualmente tus ingresos y gastos. BudgetIQ los categoriza al instante.' },
  { step: '2', title: 'Asigna o deja que la IA decida', desc: 'Distribuye tu presupuesto manualmente con barras interactivas, o activa el modo IA para un plan optimizado.' },
  { step: '3', title: 'Sigue tu progreso en tiempo real', desc: 'Visualiza el feedback de tus barras de progreso y el gráfico circular. Ajusta sobre la marcha.' },
]

const TESTIMONIALS = [
  { initials: 'MR', name: 'Marta Ruiz', text: 'Nunca había podido ahorrar de forma constante. El modo IA me generó un plan en segundos y ahora ahorro el 20% de mis ingresos.' },
  { initials: 'CG', name: 'Carlos Gómez', text: 'Las barras de progreso me dan una claridad mental increíble. Veo exactamente a dónde va mi dinero.' },
  { initials: 'AL', name: 'Ana López', text: 'Probé varias apps y BudgetIQ es la única que se quedó. La combinación de control manual + IA es perfecta.' },
]

const FAQS = [
  { q: '¿BudgetIQ es gratis?', a: 'Sí, tiene un plan gratuito con hasta 10 categorías, barras de progreso y modo IA estándar. Premium (€4,99/mes) desbloquea categorías ilimitadas y análisis avanzados.' },
  { q: '¿Cómo funciona el modo IA?', a: 'Analiza tus ingresos, gastos y objetivos, aplica algoritmos basados en mejores prácticas financieras (regla 50/30/20 adaptada) y genera un plan de distribución optimizado con gráfico circular.' },
  { q: '¿Mis datos están seguros?', a: 'Todos tus datos se cifran con AES-256 en reposo y TLS 1.3 en tránsito. No compartimos ni vendemos tu información. Cumplimos con GDPR.' },
  { q: '¿Puedo usarlo sin conectar mi banco?', a: 'Sí, puedes introducir todo manualmente. La conexión bancaria es opcional.' },
  { q: '¿En qué dispositivos está disponible?', a: 'BudgetIQ es una web app (PWA) que funciona en cualquier navegador. Puedes instalarla en tu móvil como una app nativa.' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

function FadeInSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [faqOpen, setFaqOpen] = useState<string | null>('0')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <style>{`
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .anim-fade { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s ease forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .anim-float { animation: float 3s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.15); } 50% { box-shadow: 0 0 40px rgba(5, 150, 105, 0.3); } }
        .card-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-lg shadow-sm border-b border-slate-200' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900" aria-label="BudgetIQ inicio">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">BQ</div>
            Budget<span className="text-emerald-600">IQ</span>
          </a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Funciones</a>
            <a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cómo funciona</a>
            <a href="#faq" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
            <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" aria-label="Iniciar sesión">
              <LogIn size={14} /> Iniciar sesión
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-emerald-600/20" aria-label="Ir a la aplicación">
              Ir a la App
            </button>
          </nav>
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 text-slate-700" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3" role="menu">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-1" role="menuitem">Funciones</a>
            <a href="#how" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-1" role="menuitem">Cómo funciona</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-1" role="menuitem">FAQ</a>
            <button onClick={() => { setMenuOpen(false); navigate('/login') }} className="w-full text-sm font-medium text-slate-600 py-1" role="menuitem">Iniciar sesión</button>
            <button onClick={() => { setMenuOpen(false); navigate('/dashboard') }} className="w-full text-sm font-semibold px-5 py-2.5 bg-slate-900 text-white rounded-full">Ir a la App</button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-emerald-50/80 via-white to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:grid md:grid-cols-2 md:gap-12 items-center">
          <div className="anim-fade" style={{animationDelay: '0.1s'}}>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">Lanzamiento 2026</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
              Tu inteligencia <span className="text-emerald-600">financiera personal</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Optimiza tu dinero de dos formas: asigna presupuestos con barras de progreso interactivas, o deja que la IA genere un plan de distribución optimizado al instante.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white font-semibold rounded-full text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 hover:shadow-emerald-600/20" aria-label="Ir a la aplicación">
                Ir a la App <ArrowRight size={16} />
              </button>
              <a href="#how" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-full text-sm hover:border-slate-300 transition-all">Cómo funciona</a>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div><strong className="text-2xl font-extrabold text-slate-900">+12k</strong><p className="text-xs text-slate-400 mt-0.5">usuarios activos</p></div>
              <div><strong className="text-2xl font-extrabold text-emerald-600">€2.3M</strong><p className="text-xs text-slate-400 mt-0.5">optimizados</p></div>
              <div><strong className="text-2xl font-extrabold text-slate-900">4.9★</strong><p className="text-xs text-slate-400 mt-0.5">valoración</p></div>
            </div>
          </div>
          <div className="mt-10 md:mt-0 anim-fade anim-float" style={{animationDelay: '0.3s'}}>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-sm mx-auto card-glow">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-slate-900">Saldo a organizar</h3>
                <span className="text-2xl font-extrabold text-emerald-600">€2.700</span>
              </div>
              {[
                { label: 'Vivienda', amount: '€950', pct: 100, color: 'bg-emerald-500' },
                { label: 'Alimentación', amount: '€600', pct: 80, color: 'bg-blue-500' },
                { label: 'Ahorro', amount: '€500', pct: 70, color: 'bg-violet-500' },
                { label: 'Ocio', amount: '€300', pct: 67, color: 'bg-amber-500' },
                { label: 'Transporte', amount: '€200', pct: 80, color: 'bg-teal-500' },
              ].map((item, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-700">{item.label}</span><span className="text-slate-400">{item.amount}</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{width: `${item.pct}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <FadeInSection>
        <section className="py-16 md:py-20 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Categorías</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Organiza tu dinero por categorías</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8">Selecciona las categorías que se ajustan a tu vida y empieza a asignar tu presupuesto al instante.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORIES.map((c, i) => (
                <div key={c.name} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="text-2xl mb-1">{c.emoji}</div>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{c.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Cómo funciona */}
      <FadeInSection delay={100}>
        <section id="how" className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Cómo funciona</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">De tus ingresos a la optimización en minutos</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-12">Elige tu modo: control manual total o inteligencia artificial. Ambos caminos llevan a dinero mejor organizado.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map(f => (
                <div key={f.step} className="text-center group">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-extrabold mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">{f.step}</div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Features */}
      <FadeInSection delay={100}>
        <section id="features" className="py-16 md:py-20 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Funcionalidades</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Todo lo que necesitas</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><BarChart3 size={20} className="text-emerald-600" /></div>
                  <h3 className="text-lg font-bold">Barras de progreso interactivas</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Asigna cantidades por categoría y observa cómo las barras reaccionan al instante. El saldo total se actualiza en tiempo real.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Feedback visual instantáneo', 'Saldo total visible siempre', 'Categorías 100% personalizables', 'Límites inteligentes'].map(item => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center"><Brain size={20} className="text-violet-600" /></div>
                  <h3 className="text-lg font-bold">Modo IA <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded ml-1 align-middle">IA</span></h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Activa la IA y BudgetIQ analizará tus datos para generar un plan de distribución optimizado con gráfico circular detallado.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {['Análisis inteligente de tus finanzas', 'Distribución optimizada al instante', 'Gráfico circular interactivo', 'Ajustes dinámicos automáticos'].map(item => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3">Empieza gratis, sin tarjeta</h3>
                <p className="text-emerald-100 text-sm md:text-base max-w-lg mx-auto mb-6">Únete a los +12.000 usuarios que ya optimizan sus finanzas con BudgetIQ. La versión gratuita incluye todas las funciones esenciales.</p>
                <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-full text-sm hover:bg-emerald-50 transition-all shadow-xl" aria-label="Ir a la aplicación">
                  Ir a la App <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Testimonios */}
      <FadeInSection delay={100}>
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Testimonios</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10">Lo que dicen nuestros usuarios</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-left hover:shadow-md transition-shadow duration-300">
                  <div className="text-amber-400 text-sm mb-3" aria-label="5 estrellas">★★★★★</div>
                  <p className="text-sm text-slate-600 italic mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">{t.initials}</div>
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection delay={100}>
        <section id="faq" className="py-16 md:py-20 bg-slate-50/50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10">Preguntas frecuentes</h2>
            <div className="text-left space-y-2">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === String(i) ? null : String(i))}
                    className="w-full flex justify-between items-center px-5 py-4 text-sm font-semibold text-slate-900 text-left"
                    aria-expanded={faqOpen === String(i)}
                    aria-controls={`faq-answer-${i}`}
                  >
                    {f.q}
                    <span className={`text-slate-400 text-xl transition-transform duration-200 ${faqOpen === String(i) ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {faqOpen === String(i) && (
                    <div id={`faq-answer-${i}`} className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-lg font-extrabold text-white mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">BQ</div>
                Budget<span className="text-emerald-400">IQ</span>
              </div>
              <p className="text-xs leading-relaxed">Tu inteligencia financiera personal. Optimiza tu dinero con la ayuda de la IA.</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Producto</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Modo IA</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Modo Manual</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Compañía</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Descarga</h5>
              <div className="flex flex-col gap-2 text-xs">
                <span className="text-slate-500">App Web (PWA)</span>
                <span className="text-slate-500">iOS · Android · Web</span>
                <button onClick={() => navigate('/dashboard')} className="mt-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  Ir a la App →
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-xs">
            <span>&copy; 2026 BudgetIQ. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
