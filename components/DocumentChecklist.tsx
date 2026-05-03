'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface DocumentChecklistProps {
  documents: string[]
  title?: string
}

export function DocumentChecklist({ documents, title = 'Required Documents' }: DocumentChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  if (!documents || documents.length === 0) return null

  const doneCount = checked.size

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h4 className="font-syne font-bold text-sm">{title}</h4>
        <span className="text-xs text-gray-500 font-mono">
          {doneCount}/{documents.length} ready
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-green-500 transition-all"
          style={{ width: `${documents.length ? (doneCount / documents.length) * 100 : 0}%` }}
        />
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-100">
        {documents.map((doc, i) => (
          <li
            key={i}
            onClick={() => toggle(i)}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors',
              checked.has(i) ? 'bg-green-50' : 'hover:bg-gray-50'
            )}
          >
            <span
              className={clsx(
                'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                checked.has(i)
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300'
              )}
            >
              {checked.has(i) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-6.5-1-1z" />
                </svg>
              )}
            </span>
            <span className={clsx('text-sm', checked.has(i) && 'line-through text-gray-400')}>
              {doc}
            </span>
          </li>
        ))}
      </ul>

      {doneCount === documents.length && documents.length > 0 && (
        <div className="px-4 py-3 bg-green-50 text-green-700 text-sm font-medium text-center">
          ✓ All documents ready!
        </div>
      )}
    </div>
  )
}
