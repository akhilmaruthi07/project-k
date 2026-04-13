/** Categories shown in filters and notice forms */
export const NOTICE_CATEGORIES = ['Exam', 'Event', 'Urgent', 'General']

/** Sort options for the notice feed */
export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'priority', label: 'Priority (pinned & urgent)' },
]

/** User role values stored on Parse.User */
export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
}

/** Parse class name for notices */
export const NOTICE_CLASS = 'Notices'
