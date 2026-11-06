import { cloneElement, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

const ALIGN = {
  left: 'left-0 origin-top-left',
  right: 'right-0 origin-top-right',
  center: 'left-1/2 -translate-x-1/2 origin-top',
}

export function Popover({ trigger, children, align = 'right', panelClassName }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const triggerElement = cloneElement(trigger, {
    'aria-expanded': open,
    onClick: (event) => {
      trigger.props.onClick?.(event)
      setOpen((value) => !value)
    },
  })

  return (
    <div className="relative" ref={wrapperRef}>
      {triggerElement}
      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              'glass-popover absolute top-full z-[80] mt-2.5 overflow-hidden',
              ALIGN[align] ?? ALIGN.right,
              panelClassName,
            )}
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
