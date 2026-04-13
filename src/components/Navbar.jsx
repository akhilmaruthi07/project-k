import { motion as Motion } from 'framer-motion'
import { LayoutGrid, LogOut, Moon, Search, Sun } from 'lucide-react'
import { SORT_OPTIONS } from '../lib/constants'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'Exam', label: 'Exam' },
  { id: 'Event', label: 'Event' },
  { id: 'Urgent', label: 'Urgent' },
  { id: 'General', label: 'General' },
]

/**
 * Sticky top bar: brand, search, category filter, sort, theme, sign out.
 */
export function Navbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  subtitle,
}) {
  const { theme, toggleTheme } = useTheme()
  const { logout, role, user } = useAuth()

  return (
    <Motion.header
      layout
      className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/75"
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25">
              <LayoutGrid className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Digital Notice Board
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {subtitle ?? `${role === 'admin' ? 'Admin' : 'Student'} · ${user?.get?.('username') ?? ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-2xl bg-zinc-100/80 p-1 dark:bg-zinc-900/80">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2 text-zinc-600 transition hover:bg-white hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-xl p-2 text-zinc-600 transition hover:bg-white hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search notices…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="category-filter">
              Category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="min-w-[140px] rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="sort-filter">
              Sort
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="min-w-[180px] rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Motion.header>
  )
}
