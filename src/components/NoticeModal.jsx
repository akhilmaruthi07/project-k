import { AnimatePresence, motion as Motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { NOTICE_CATEGORIES } from '../lib/constants'
import { Button } from './Button'

const emptyForm = {
  title: '',
  content: '',
  category: 'General',
  expiryDate: '',
  isPinned: false,
  isUrgent: false,
}

function toInputDate(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Default form state; parent should remount this component with `key` when `initial` changes. */
function buildFormValues(initial) {
  if (initial) {
    return {
      title: initial.title ?? '',
      content: initial.content ?? '',
      category: initial.category ?? 'General',
      expiryDate: toInputDate(initial.expiryDate),
      isPinned: Boolean(initial.isPinned),
      isUrgent: Boolean(initial.isUrgent),
    }
  }
  return {
    ...emptyForm,
    expiryDate: toInputDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  }
}

export function NoticeModal({ open, onClose, onSubmit, initial, busy }) {
  const [form, setForm] = useState(() => buildFormValues(initial))

  const handleSubmit = (e) => {
    e.preventDefault()
    const expiry = new Date(form.expiryDate)
    if (Number.isNaN(expiry.getTime())) {
      return
    }
    onSubmit({
      title: form.title,
      content: form.content,
      category: form.category,
      expiryDate: expiry,
      isPinned: form.isPinned,
      isUrgent: form.isUrgent,
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.button
            type="button"
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/60"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
            className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-[var(--shadow-soft-lg)] dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <h2 id="notice-modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {initial ? 'Edit notice' : 'New notice'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
              <label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Title
              </label>
              <input
                required
                className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-0 transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Midterm schedule"
              />

              <label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Content
              </label>
              <textarea
                required
                rows={5}
                className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Full notice text…"
              />

              <label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Category
              </label>
              <select
                className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {NOTICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Expiry
              </label>
              <input
                required
                type="datetime-local"
                className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={form.expiryDate}
                onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              />

              <div className="mb-6 flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                    className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
                  />
                  Pin to top
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.isUrgent}
                    onChange={(e) => setForm((f) => ({ ...f, isUrgent: e.target.checked }))}
                    className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                  />
                  Mark as urgent
                </label>
              </div>

              <div className="mt-auto flex justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : initial ? 'Save changes' : 'Publish'}
                </Button>
              </div>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
