import { motion as Motion } from 'framer-motion'
import { Bell, LayoutDashboard, PlusCircle } from 'lucide-react'

const items = [
  { id: 'board', label: 'Notice board', icon: LayoutDashboard },
  { id: 'create', label: 'New notice', icon: PlusCircle },
  { id: 'alerts', label: 'Tips', icon: Bell },
]

/**
 * Admin sidebar — compact navigation with subtle glass styling.
 */
export function Sidebar({ active, onSelect, onCreateClick }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-200/80 bg-white/60 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/60 lg:block">
      <div className="sticky top-[72px] px-3 py-6">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
          Admin
        </p>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.id !== 'create' && active === item.id
            return (
              <Motion.button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'create') onCreateClick?.()
                  else onSelect?.(item.id)
                }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Motion.button>
            )
          })}
        </nav>
        <p className="mt-8 px-3 text-xs leading-relaxed text-zinc-500">
          Tip: pin important notices and set expiry so the board stays tidy.
        </p>
      </div>
    </aside>
  )
}
