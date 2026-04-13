import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Navbar } from '../components/Navbar'
import { DashboardLayout } from '../components/DashboardLayout'
import { NoticeCard } from '../components/NoticeCard'
import { NoticeDetailModal } from '../components/NoticeDetailModal'
import { SkeletonList } from '../components/Skeleton'
import { useNotices } from '../hooks/useNotices'

export function StudentDashboard() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [selected, setSelected] = useState(null)

  const { notices, loading, error, reload } = useNotices({
    includeExpired: false,
    category,
    search,
    sortBy,
  })

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <DashboardLayout>
      <Navbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        subtitle="Your notices · live countdowns"
      />

      <section className="py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Feed</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {notices.length} active notice{notices.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => reload()}
            className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <SkeletonList count={6} />
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-zinc-600 dark:text-zinc-400">No notices match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {notices.map((n, i) => (
              <NoticeCard
                key={n.id}
                notice={n}
                index={i}
                onClick={() => setSelected(n)}
              />
            ))}
          </div>
        )}
      </section>

      <NoticeDetailModal notice={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </DashboardLayout>
  )
}
