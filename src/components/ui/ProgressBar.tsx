import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
  color?: string
  height?: number
}

export default function ProgressBar({ value, max, color = '#6366f1', height = 10 }: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className="w-full bg-surface-lighter rounded-full overflow-hidden" style={{ height }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
