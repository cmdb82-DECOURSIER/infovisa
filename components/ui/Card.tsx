import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ hover = false, padding = 'md', className, children, ...props }: CardProps) {
  const paddings = { sm: 'p-3', md: 'p-5', lg: 'p-8' }
  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-xl',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-amber transition-all cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
