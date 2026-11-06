import { cn } from './cn'

const SIZE_CLASSES = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon',
}

const VARIANT_CLASSES = {
  primary: 'btn-primary',
  glass: 'btn-glass',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

export function buttonStyles({ variant = 'glass', size = 'md', className } = {}) {
  return cn('btn', VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.glass, SIZE_CLASSES[size], className)
}
