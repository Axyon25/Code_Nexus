import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { teamActivity } from '../../data/mockData'
import { relativeTime } from '../../utils/format'
import { Avatar } from '../common/Avatar'

export function TeamActivityCard() {
  const { getUser } = useAppData()

  return (
    <section className="glass-card flex flex-col p-4 sm:p-5" aria-labelledby="team-activity-heading">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="team-activity-heading" className="text-sm font-semibold tracking-tight text-ink">
            Team activity
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">Recently recorded human actions</p>
        </div>
        <Link
          to="/team"
          className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--teal-soft)] text-[var(--teal)] transition-transform hover:scale-105"
          aria-label="Open team page"
        >
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-4 space-y-3.5">
        {teamActivity.slice(0, 5).map((event) => {
          const actor = getUser(event.actorId)
          return (
            <li key={event.id} className="flex items-start gap-2.5">
              <Avatar user={actor} size="sm" />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] leading-relaxed text-muted">
                  <span className="font-semibold text-ink">{actor?.name?.split(' ')[0]}</span>{' '}
                  {event.action}{' '}
                  {event.targetId ? (
                    <Link
                      to={`/review/${event.targetId}`}
                      className="font-medium text-ink underline decoration-[var(--line-strong)] underline-offset-2 transition-colors hover:text-[var(--accent)]"
                    >
                      {event.target}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink">{event.target}</span>
                  )}
                </p>
                <p className="mt-0.5 text-[9px] text-subtle">{relativeTime(event.at)}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <Link
        to="/team"
        className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-3 text-[10px] font-medium text-muted transition-colors hover:text-ink"
      >
        View team & roles
        <Users className="h-3 w-3" aria-hidden="true" />
      </Link>
    </section>
  )
}
