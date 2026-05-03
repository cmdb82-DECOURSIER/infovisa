'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  type?: AlertType
  message: string
  dismissable?: boolean
}

const STYLES: Record<AlertType, string> = {
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber/10 border-amber/30 text-amber-dim',
  error:   'bg-red-50 border-red-200 text-red-800',
}

const ICONS: Record<AlertType, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌',
}

export function Alert({ type = 'info', message, dismissable = false }: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className={clsx('flex items-start gap-3 px-4 py-3 border rounded-lg text-sm', STYLES[type])}>
      <span>{ICONS[type]}</span>
      <span className="flex-1">{message}</span>
      {dismissable && (
        <button onClick={() => setDismissed(true)} className="opacity-60 hover:opacity-100 ml-2 text-lg leading-none">×</button>
      )}
    </div>
  )
}
