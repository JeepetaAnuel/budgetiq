import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface Props extends LucideProps {
  name: string
}

export default function Icon({ name, ...props }: Props) {
  const icons = Icons as unknown as Record<string, React.ComponentType<LucideProps>>
  const Component = icons[name]
  if (!Component) return null
  return <Component {...props} />
}
