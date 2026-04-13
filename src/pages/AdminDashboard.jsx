import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { DashboardLayout } from '../components/DashboardLayout'
import { NoticeModal } from '../components/NoticeModal'
import { NoticeCard } from '../components/NoticeCard'
import { Button } from '../components/Button'
import { SkeletonList } from '../components/Skeleton'
import { useNotices } from '../hooks/useNotices'
import { createNotice, deleteNotice, updateNotice } from '../lib/noticesApi'

function isExpired(notice) {
  if (!notice.expiryDate) return true
  return new Date(notice.expiryDate) <= new Date()
}

export function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [modalNonce, setModalNonce] = useState(0)
  const [busy, setBusy] = useState(false)
  const [sidebarActive, setSidebarActive] = useState('board')

  const { notices, loading, error, reload } = useNotices({
    includeExpired: true,
    category,
    search,
    sortBy,
  })

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const openCreate = () => {
    setEditing(null)
    setModalNonce((n) => n + 1)
    setModalOpen(true)
  }

  const openEdit = (n) => {
    setEditing(n)
    setModalNonce((x) => x + 1)
    setModalOpen(true)
  }

  const handleSubmit = async (data) => {
    setBusy(true)
    try {
      if (editing?.id) {
        await updateNotice(editing.id, data)
        toast.success('Notice updated')
      } else {
        await createNotice(data)
        toast.success('Notice published')
      }
      setModalOpen(false)
      setEditing(null)
      await reload()
    } catch (e) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice permanently?')) return
    setBusy(true)
    try {
      await deleteNotice(id)
      toast.success('Notice deleted')
      await reload()
    } catch (e) {
      toast.error(e?.message || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          active={sidebarActive}
          onSelect={setSidebarActive}
          onCreateClick={openCreate}
        />
      }
    >
      <Navbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        subtitle="Manage notices & expiry"
      />

      <section className="py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Notice management</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {notices.length} notice{notices.length === 1 ? '' : 's'} (including expired)
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => reload()}>
              Refresh
            </Button>
            <Button type="button" onClick={openCreate}>
              New notice
            </Button>
          </div>
        </div>

        {/* Mobile: show sidebar actions */}
        <div className="mb-4 flex gap-2 lg:hidden">
          <Button type="button" className="flex-1" onClick={openCreate}>
            New notice
          </Button>
        </div>

        {loading ? (
          <SkeletonList count={6} />
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">No notices yet.</p>
            <Button type="button" onClick={openCreate}>
              Create the first notice
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {notices.map((n, i) => (
              <div key={n.id} className="relative">
                <NoticeCard notice={n} index={i} onClick={() => openEdit(n)} />
                {isExpired(n) && (
                  <span className="absolute right-3 top-3 rounded-full bg-zinc-900/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
                    Expired
                  </span>
                )}
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 text-xs"
                    onClick={() => openEdit(n)}
                    disabled={busy}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    className="flex-1 text-xs"
                    onClick={() => handleDelete(n.id)}
                    disabled={busy}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <NoticeModal
        key={modalNonce}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        initial={editing}
        onSubmit={handleSubmit}
        busy={busy}
      />
    </DashboardLayout>
  )
}
