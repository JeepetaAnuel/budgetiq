type PulseProps = React.HTMLAttributes<HTMLDivElement> & { className?: string }

function Pulse({ className = '', style, ...rest }: PulseProps) {
  return (
    <div
      className={`animate-pulse bg-surface-lighter rounded-lg ${className}`}
      aria-hidden="true"
      style={style}
      {...rest}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-8 w-8 rounded-lg" />
      </div>
      <Pulse className="h-6 w-24 mt-1" />
    </div>
  )
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-6">
        <Pulse className="h-10 w-10 rounded-xl" />
        <div>
          <Pulse className="h-4 w-36 mb-1" />
          <Pulse className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-end gap-3" style={{ height }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse
            key={i}
            className={`flex-1 rounded-t-lg`}
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function TransactionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Pulse className="h-4 w-40 mb-1" />
          <Pulse className="h-3 w-24" />
        </div>
        <Pulse className="h-3 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Pulse className="h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-3.5 w-3/5" />
              <Pulse className="h-3 w-1/4" />
            </div>
            <Pulse className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BudgetCardSkeleton() {
  return (
    <div className="bg-surface-light border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Pulse className="h-10 w-10 rounded-xl" />
          <div>
            <Pulse className="h-4 w-28 mb-1" />
            <Pulse className="h-3 w-24" />
          </div>
        </div>
        <Pulse className="h-5 w-12 rounded-lg" />
      </div>
      <Pulse className="h-2.5 w-full rounded-full mb-2" />
      <div className="flex justify-between">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-3 w-16" />
      </div>
    </div>
  )
}

export function KPIBarSkeleton() {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-4">
      <div className="flex items-center gap-6 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Pulse className="h-2.5 w-16" />
            <Pulse className="h-5 w-24" />
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <Pulse className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Pulse className="h-2.5 w-12" />
            <Pulse className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PieChartSkeleton() {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-6">
        <Pulse className="h-10 w-10 rounded-xl" />
        <div>
          <Pulse className="h-4 w-36 mb-1" />
          <Pulse className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Pulse className="h-32 w-32 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Pulse className="h-2 w-2 rounded-full" />
              <Pulse className="h-3 flex-1" />
              <Pulse className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <KPIBarSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <ChartSkeleton height={200} />
          <TransactionListSkeleton rows={4} />
        </div>
        <div className="lg:col-span-5 space-y-5">
          <PieChartSkeleton />
          <div className="bg-surface-light border border-border rounded-xl p-5 space-y-3">
            <Pulse className="h-4 w-36" />
            <Pulse className="h-3 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <BudgetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


