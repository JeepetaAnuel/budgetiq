import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  value: string
  icon: ReactNode
  trend?: { value: number; up: boolean }
  accent?: 'brand' | 'success' | 'danger'
}

const accents = {
  brand: { ring: 'from-brand-500/20 to-brand-600/20', icon: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  success: { ring: 'from-success/20 to-success/20', icon: 'bg-success/10 text-success border-success/20' },
  danger: { ring: 'from-danger/20 to-danger/20', icon: 'bg-danger/10 text-danger border-danger/20' },
}

export default function StatCard({ title, value, icon, trend, accent = 'brand' }: Props) {
  const a = accents[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${a.ring} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative bg-surface-light border border-border rounded-2xl p-4 sm:p-5 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</span>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${a.icon}`}>
            {icon}
          </div>
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className="flex items-center gap-1.5 mt-1 sm:mt-2">
            <span className={`text-xs font-semibold ${trend.up ? 'text-success' : 'text-danger'}`}>
              {trend.up ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-text-muted">vs mes anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}