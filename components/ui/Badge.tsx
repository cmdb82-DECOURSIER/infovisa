import { clsx } from 'clsx'

type BadgeColor = 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'gray'

interface BadgeProps {
  label: string
  color?: BadgeColor
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const COLORS: Record<BadgeColor, string> = {
  amber:  'bg-amber/15 text-amber-dim border-amber/30',
  green:  'bg-green-50 text-green-700 border-green-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray:   'bg-gray-100 text-gray-600 border-gray-200',
}

const DOT_COLORS: Record<BadgeColor, string> = {
  amber: 'bg-amber', green: 'bg-green-500', red: 'bg-red-500',
  blue: 'bg-blue-500', purple: 'bg-purple-500', gray: 'bg-gray-400',
}

export function Badge({ label, color = 'gray', size = 'md', dot = false }: BadgeProps) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-medium rounded-full border', COLORS[color], sizes[size])}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOT_COLORS[color])} />}
      {label}
    </span>
  )
}
