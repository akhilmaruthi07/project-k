import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Clock, Pin, X, Zap } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

export function NoticeDetailModal({ notice, open, onClose }) {
  const expiry =
    notice?.expiryDate instanceof Date
      ? notice.expiryDate
      : notice?.expiryDate
        ? new Date(notice.expiryDate)
        : null
  const countdown = useCountdown(expiry)
  const showUrgent = notice?.isUrgent || notice?.category === 'Urgent'

  return (
    <AnimatePresence>
      {open && notice && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.button
            type="button"
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/60"
            aria-label="Close"
            onClick={onClose}
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-soft-lg)] dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-3xl"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {notice.category}
                </span>
                {notice.isPinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </span>
                )}
                {showUrgent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/15 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    <Zap className="h-3 w-3" />
                    Urgent
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {notice.title}
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {notice.content}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4 text-sm text-zinc-500 dark:border-zinc-800">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {countdown.expired ? (
                  <span className="text-rose-600 dark:text-rose-400">Expired</span>
                ) : (
                  <span>Expires in {countdown.label}</span>
                )}
              </span>
              {notice.createdByName && (
                <span className="text-zinc-400">@{notice.createdByName}</span>
              )}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
