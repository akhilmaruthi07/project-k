import { motion as Motion } from 'framer-motion'

export function NoticeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-[var(--shadow-soft)] dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mb-3 flex items-center gap-2">
        <Motion.div
          className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <Motion.div
          className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
        />
      </div>
      <Motion.div
        className="mb-2 h-5 w-[75%] rounded bg-zinc-200 dark:bg-zinc-700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
      />
      <Motion.div
        className="mb-1 h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <Motion.div
        className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.25 }}
      />
    </div>
  )
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NoticeCardSkeleton key={i} />
      ))}
    </div>
  )
}
