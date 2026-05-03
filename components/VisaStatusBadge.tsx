import { clsx } from 'clsx'

type VisaStatus = 'Not Required' | 'Visa on Arrival' | 'eVisa' | 'Visa Required' | string

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'Not Required':    { label: 'Visa Free',       color: 'bg-green-100 text-green-800 border-green-200' },
  'Visa on Arrival': { label: 'Visa on Arrival',  color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'eVisa':           { label: 'eVisa',            color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'Visa Required':   { label: 'Visa Required',    color: 'bg-red-100 text-red-800 border-red-200' },
}

interface VisaStatusBadgeProps {
  status: VisaStatus
  size?: 'sm' | 'md' | 'lg'
  showDot?: boolean
}

export function VisaStatusBadge({ status, size = 'md', showDot = true }: VisaStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.color,
        sizes[size]
      )}
    >
      {showDot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full', {
            'bg-green-500':  status === 'Not Required',
            'bg-blue-500':   status === 'Visa on Arrival',
            'bg-purple-500': status === 'eVisa',
            'bg-red-500':    status === 'Visa Required',
            'bg-gray-500':   !STATUS_CONFIG[status],
          })}
        />
      )}
      {config.label}
    </span>
  )
}
