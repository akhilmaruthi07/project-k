import { motion as Motion } from 'framer-motion'
import { Pin, Zap, Clock } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

const categoryRing = {
  Exam: 'ring-sky-500/30',
  Event: 'ring-violet-500/30',
  Urgent: 'ring-rose-500/40',
  General: 'ring-zinc-400/30',
}

const categoryBadge = {
  Exam: 'bg-sky-500/15 text-sky-800 dark:text-sky-200',
  Event: 'bg-violet-500/15 text-violet-800 dark:text-violet-200',
  Urgent: 'bg-rose-500/15 text-rose-800 dark:text-rose-200',
  General: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
}

function preview(text, max = 140) {
  const t = text?.replace(/\s+/g, ' ').trim() ?? ''
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

export function NoticeCard({ notice, index = 0, onClick, layoutId }) {
  const expiry =
    notice.expiryDate instanceof Date
      ? notice.expiryDate
      : notice.expiryDate
        ? new Date(notice.expiryDate)
        : null
  const countdown = useCountdown(expiry)
  const cat = notice.category || 'General'
  const ring = categoryRing[cat] ?? categoryRing.General
  const badge = categoryBadge[cat] ?? categoryBadge.General
  const showUrgent = notice.isUrgent || cat === 'Urgent'

  return (
    <Motion.article
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-[var(--shadow-soft)] ring-1 ring-transparent transition hover:shadow-[var(--shadow-soft-lg)] dark:border-zinc-800 dark:bg-zinc-900/90 ${ring} hover:ring-2`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}
        >
          {cat}
        </span>
        {notice.isPinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
            <Pin className="h-3 w-3" aria-hidden />
            Pinned
          </span>
        )}
        {showUrgent && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/15 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <Zap className="h-3 w-3" aria-hidden />
            Urgent
          </span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {notice.title}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {preview(notice.content)}
      </p>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {countdown.expired ? (
            <span className="text-rose-600 dark:text-rose-400">Expired</span>
          ) : (
            <span>Expires in {countdown.label}</span>
          )}
        </span>
        {notice.createdByName && (
          <span className="truncate text-zinc-400">@{notice.createdByName}</span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent opacity-0 transition group-hover:opacity-100" />
    </Motion.article>
  )
}
