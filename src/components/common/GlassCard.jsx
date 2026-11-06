import { cn } from '../../utils/cn'

export function GlassCard({ as: Tag = 'div', hover = false, className, children, ...props }) {
  return (
    <Tag className={cn('glass-card', hover && 'glass-card-lift', className)} {...props}>
      {children}
    </Tag>
  )
}
