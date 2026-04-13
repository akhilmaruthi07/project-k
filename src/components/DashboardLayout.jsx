import { motion as Motion } from 'framer-motion'

export function DashboardLayout({ children, sidebar }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.12),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.08),transparent)]">
      <div className="mx-auto flex max-w-7xl">
        {sidebar}
        <Motion.main
          className="min-w-0 flex-1 px-4 py-2 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </Motion.main>
      </div>
    </div>
  )
}
