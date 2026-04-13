import { motion as Motion } from 'framer-motion'

const variants = {
  primary:
    'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200',
  secondary:
    'bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400',
  ghost: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <Motion.button
      type={type}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </Motion.button>
  )
}
