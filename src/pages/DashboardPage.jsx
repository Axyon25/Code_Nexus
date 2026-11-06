import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FilePlus2,
  Files,
  ScanSearch,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { dashboardStats } from '../data/mockData'
import { buttonStyles } from '../utils/buttonStyles'
import { PageHeader } from '../components/common/PageHeader'
import { ActivityChart } from '../components/dashboard/ActivityChart'
import { PendingApprovalsCard } from '../components/dashboard/PendingApprovalsCard'
import { RecentIssuesCard } from '../components/dashboard/RecentIssuesCard'
import { RecentReviewsTable } from '../components/dashboard/RecentReviewsTable'
import { ReviewHealth } from '../components/dashboard/ReviewHealth'
import { StatCard } from '../components/dashboard/StatCard'
import { TeamActivityCard } from '../components/dashboard/TeamActivityCard'

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export default function DashboardPage() {
  const { currentUser, reviews, role } = useAppData()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = currentUser.name.split(' ')[0]
  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  const exportSnapshot = () => {
    const header = [
      'ID',
      'Title',
      'Content type',
      'Status',
      'Compliance score',
      'Total findings',
      'Open findings',
      'Created',
      'Updated',
    ]
    const rows = reviews.map((review) => [
      review.id,
      review.title,
      review.contentType,
      review.status,
      review.complianceScore,
      review.findings.length,
      review.findings.filter((finding) => finding.status === 'pending').length,
      review.createdAt,
      review.updatedAt,
    ])
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'truth-nuke-review-snapshot.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success('Snapshot exported', {
      description: `${reviews.length} reviews exported as CSV from local demo data.`,
    })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={dateLabel}
        title={
          <>
            {greeting}, <span className="font-serif font-normal italic text-[var(--accent)]">{firstName}</span>.
          </>
        }
        description="Here is the governance picture today. Every finding still needs a human decision before content can be approved."
        actions={
          <>
            {role !== 'Reviewer' && (
              <Link to="/review/new" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                <FilePlus2 className="h-3.5 w-3.5" aria-hidden="true" />
                New review
              </Link>
            )}
            {role !== 'Creator' && (
              <Link to="/approvals" className={buttonStyles({ variant: 'glass', size: 'sm' })}>
                <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Approval queue
              </Link>
            )}
            <button type="button" onClick={exportSnapshot} className={buttonStyles({ variant: 'glass', size: 'icon' })} aria-label="Export review snapshot as CSV" title="Export snapshot">
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        }
      />

      <section aria-label="Overview statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total reviews"
          value={dashboardStats.totalReviews}
          delta={dashboardStats.totalTrend}
          icon={Files}
          tone="info"
          series={[4, 6, 5, 8, 7, 9, 8, 11, 10, 12]}
        />
        <StatCard
          label="Pending reviews"
          value={dashboardStats.pendingReviews}
          delta={dashboardStats.pendingTrend}
          deltaLabel="vs last week"
          icon={Timer}
          tone="warning"
          series={[9, 8, 9, 7, 6, 7, 5, 6, 4, 5]}
        />
        <StatCard
          label="Approved content"
          value={dashboardStats.approvedContent}
          delta={dashboardStats.approvedTrend}
          icon={CheckCircle2}
          tone="success"
          series={[5, 6, 7, 7, 9, 10, 9, 11, 12, 14]}
        />
        <StatCard
          label="Issues detected"
          value={dashboardStats.issuesDetected}
          delta={dashboardStats.issuesTrend}
          icon={ScanSearch}
          tone="violet"
          series={[12, 10, 11, 9, 10, 8, 7, 8, 6, 6]}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityChart />
        </div>
        <ReviewHealth />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentReviewsTable />
        </div>
        <PendingApprovalsCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentIssuesCard />
        <TeamActivityCard />
      </div>

      <div className="flex flex-col items-start justify-between gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-[10px] leading-relaxed text-subtle">
          Dashboard figures are illustrative demo values. Review records below are stored in your
          browser and change as you accept findings or record approvals.
        </p>
        <Link
          to="/review/RV-1042"
          className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[var(--accent)] transition-opacity hover:opacity-80"
        >
          Explore the flagship review
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
