import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Store, CalendarDays, Tag, CheckCircle, X, ScanLine } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useToast } from '../store/ToastContext'
import { fmt, uid } from '../lib/utils'
import { CATEGORIES } from '../data/categories'

export default function ScanTicket() {
  const { state, addTicket, deleteTicket } = useApp()
  const { toast } = useToast()
  const { scannedTickets, preferences } = state
  const [preview, setPreview] = useState(false)

  const [ticket, setTicket] = useState({
    store: '',
    date: new Date().toISOString().slice(0, 10),
    total: '',
    category: 'food',
    items: [{ name: '', price: '' }],
  })

  function simulateScan() {
    setTicket({
      store: 'Mercadona',
      date: new Date().toISOString().slice(0, 10),
      total: '36.22',
      category: 'food',
      items: [
        { name: 'Leche semidesnatada', price: '2.10' },
        { name: 'Pan integral', price: '1.85' },
        { name: 'Huevos (docena)', price: '3.40' },
        { name: 'Pechuga pollo 1kg', price: '8.95' },
        { name: 'Arroz 5kg', price: '6.30' },
      ],
    })
    setPreview(true)
    toast({ type: 'success', title: 'Ticket escaneado', message: 'Datos extraídos correctamente.' })
  }

  function addItem() {
    setTicket({ ...ticket, items: [...ticket.items, { name: '', price: '' }] })
  }

  function removeItem(i: number) {
    setTicket({ ...ticket, items: ticket.items.filter((_, idx) => idx !== i) })
  }

  function handleSave() {
    const total = ticket.items.reduce((s, item) => s + (parseFloat(item.price) || 0), 0)
    addTicket({
      id: uid(),
      store: ticket.store,
      date: ticket.date,
      total,
      items: ticket.items.filter(item => item.name).map(item => ({ name: item.name, price: parseFloat(item.price) || 0 })),
      category: ticket.category,
    })
    toast({ type: 'success', title: 'Ticket guardado', message: `${ticket.items.filter(i => i.name).length} productos registrados.` })
    setPreview(false)
    setTicket({ store: '', date: new Date().toISOString().slice(0, 10), total: '', category: 'food', items: [{ name: '', price: '' }] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Escanear Ticket</h3>
        <p className="text-sm text-text-muted">Reconocimiento automático de tickets de compra</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div onClick={simulateScan} className="bg-surface-light border-2 border-dashed border-brand-500/30 hover:border-brand-500/50 rounded-2xl p-12 text-center cursor-pointer transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <ScanLine size={32} className="text-brand-400" />
            </div>
            <p className="text-lg font-semibold">Sube la foto del ticket</p>
            <p className="text-sm text-text-muted mt-1">PNG, JPG — Máximo 5 MB</p>
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all inline-flex items-center gap-2">
              <Camera size={16} /> Simular escaneo
            </button>
          </div>

          {scannedTickets.length > 0 && (
            <div className="mt-6 bg-surface-light border border-border rounded-2xl p-5">
              <h4 className="text-sm font-semibold mb-3">Tickets guardados ({scannedTickets.length})</h4>
              <div className="space-y-2">
                {scannedTickets.map(t => {
                  return (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-surface-lighter/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center"><Store size={14} className="text-brand-400" /></div>
                        <div>
                          <p className="text-sm font-medium">{t.store}</p>
                          <p className="text-xs text-text-muted">{t.items.length} productos · {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{fmt(t.total, preferences.currency)}</span>
                        <button onClick={() => { deleteTicket(t.id); toast({ type: 'info', title: 'Ticket eliminado' }) }} className="w-7 h-7 rounded-lg bg-danger/10 text-danger flex items-center justify-center"><X size={12} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {preview && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-surface-light border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle size={20} className="text-success" /></div>
                <div><h4 className="font-semibold">Vista previa del ticket</h4><p className="text-xs text-text-muted">Revisa los datos extraídos</p></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-surface-lighter/30 rounded-xl">
                  <Store size={16} className="text-text-muted" />
                  <input type="text" value={ticket.store} onChange={e => setTicket({ ...ticket, store: e.target.value })} className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 p-3 bg-surface-lighter/30 rounded-xl">
                  <CalendarDays size={16} className="text-text-muted" />
                  <input type="date" value={ticket.date} onChange={e => setTicket({ ...ticket, date: e.target.value })} className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 p-3 bg-surface-lighter/30 rounded-xl">
                  <Tag size={16} className="text-text-muted" />
                  <select value={ticket.category} onChange={e => setTicket({ ...ticket, category: e.target.value })} className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Productos</span>
                  <button onClick={addItem} className="text-xs text-brand-400 hover:text-brand-300">+ Añadir</button>
                </div>
                <div className="space-y-2">
                  {ticket.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={item.name} onChange={e => { const items = [...ticket.items]; items[i] = { ...items[i], name: e.target.value }; setTicket({ ...ticket, items }) }} className="flex-1 bg-surface-lighter/30 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-500/50" placeholder="Producto" />
                      <input type="number" value={item.price} onChange={e => { const items = [...ticket.items]; items[i] = { ...items[i], price: e.target.value }; setTicket({ ...ticket, items }) }} className="w-20 bg-surface-lighter/30 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-500/50 text-right" placeholder="0.00" />
                      {ticket.items.length > 1 && <button onClick={() => removeItem(i)} className="w-7 h-7 rounded-lg bg-danger/10 text-danger flex items-center justify-center flex-shrink-0"><X size={12} /></button>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 bg-brand-500/5 rounded-xl border border-brand-500/10">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold text-brand-400">
                  {fmt(ticket.items.reduce((s, item) => s + (parseFloat(item.price) || 0), 0), preferences.currency)}
                </span>
              </div>

              <button onClick={handleSave} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
                <CheckCircle size={16} /> Guardar ticket
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}