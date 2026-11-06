import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  guidelines as seedGuidelines,
  notifications as seedNotifications,
  organisation as seedOrganisation,
  reviews as seedReviews,
  users as seedUsers,
  currentUserId as seedCurrentUserId,
} from '../data/mockData'
import { makeId } from '../services/api'
import { decideReview as decideReviewMock } from '../services/approvalService'
import {
  createGuideline as createGuidelineMock,
  deleteGuideline as deleteGuidelineMock,
  updateGuideline as updateGuidelineMock,
} from '../services/guidelineService'
import { submitReview as submitReviewMock } from '../services/reviewService'
import { changeMemberRole, inviteMember as inviteMemberMock } from '../services/teamService'
import { AppDataContext } from './appDataContext'

const STORAGE_KEY = 'truthnuke-demo-state-v1'

function createSeedState() {
  const clone = (value) => JSON.parse(JSON.stringify(value))
  return {
    reviews: clone(seedReviews),
    guidelines: clone(seedGuidelines),
    team: clone(seedUsers),
    notifications: clone(seedNotifications),
    organisation: clone(seedOrganisation),
    currentUserId: seedCurrentUserId,
  }
}

function loadState() {
  if (typeof window === 'undefined') return createSeedState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.reviews) || !Array.isArray(parsed.guidelines)) {
      return createSeedState()
    }
    return { ...createSeedState(), ...parsed }
  } catch {
    return createSeedState()
  }
}

function nowIso() {
  return new Date().toISOString()
}

export function AppDataProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* Persistence is optional; the demo still works in memory. */
    }
  }, [state])

  const currentUser =
    state.team.find((member) => member.id === state.currentUserId) ?? state.team[0]

  const getUser = useCallback(
    (id) => state.team.find((member) => member.id === id) ?? null,
    [state.team],
  )

  const getGuideline = useCallback(
    (id) => state.guidelines.find((guideline) => guideline.id === id) ?? null,
    [state.guidelines],
  )

  const patchReview = useCallback((reviewId, updater) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review) =>
        review.id === reviewId ? updater(review) : review,
      ),
    }))
  }, [])

  const submitReview = useCallback(
    async (payload) => {
      setIsSubmitting(true)
      try {
        const { review } = await submitReviewMock({
          ...payload,
          guidelines: state.guidelines,
          createdBy: currentUser.id,
        })
        setState((prev) => ({ ...prev, reviews: [review, ...prev.reviews] }))
        return review
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentUser.id, state.guidelines],
  )

  const updateFinding = useCallback(
    (reviewId, findingId, status) => {
      patchReview(reviewId, (review) => {
        const target = review.findings.find((finding) => finding.id === findingId)
        return {
          ...review,
          updatedAt: nowIso(),
          findings: review.findings.map((finding) =>
            finding.id === findingId ? { ...finding, status } : finding,
          ),
          history: [
            ...review.history,
            {
              id: makeId('history'),
              action: status === 'accepted' ? 'AI suggestion accepted' : 'AI suggestion rejected',
              actorId: currentUser.id,
              note: target
                ? `Decision recorded for “${target.originalText.slice(0, 72)}${
                    target.originalText.length > 72 ? '…' : ''
                  }”`
                : 'Decision recorded.',
              at: nowIso(),
            },
          ],
        }
      })
    },
    [currentUser.id, patchReview],
  )

  const addComment = useCallback(
    (reviewId, body) => {
      if (!body.trim()) return
      patchReview(reviewId, (review) => ({
        ...review,
        comments: [
          ...review.comments,
          {
            id: makeId('comment'),
            authorId: currentUser.id,
            body: body.trim(),
            at: nowIso(),
          },
        ],
      }))
    },
    [currentUser.id, patchReview],
  )

  const sendForApproval = useCallback(
    (reviewId, note = 'Submitted for human approval.') => {
      patchReview(reviewId, (review) => ({
        ...review,
        status: 'in-review',
        updatedAt: nowIso(),
        history: [
          ...review.history,
          {
            id: makeId('history'),
            action: review.status === 'draft' ? 'Submitted for approval' : 'Resubmitted for approval',
            actorId: currentUser.id,
            note,
            at: nowIso(),
          },
        ],
      }))
    },
    [currentUser.id, patchReview],
  )

  const decideReview = useCallback(
    async (reviewId, decision, note) => {
      const result = await decideReviewMock({ decision, note })
      const review = state.reviews.find((item) => item.id === reviewId)
      patchReview(reviewId, (current) => ({
        ...current,
        status: result.status,
        reviewer: current.reviewer ?? currentUser.id,
        updatedAt: nowIso(),
        comments: result.note
          ? [
              ...current.comments,
              {
                id: makeId('comment'),
                authorId: currentUser.id,
                body: result.note,
                at: nowIso(),
              },
            ]
          : current.comments,
        history: [
          ...current.history,
          {
            id: makeId('history'),
            action: result.label,
            actorId: currentUser.id,
            note: result.note || `Decision recorded for “${review?.title ?? reviewId}”.`,
            at: nowIso(),
          },
        ],
      }))
      return result
    },
    [currentUser.id, patchReview, state.reviews],
  )

  const addGuideline = useCallback(
    async (payload) => {
      const guideline = await createGuidelineMock(payload, currentUser.id)
      setState((prev) => ({ ...prev, guidelines: [guideline, ...prev.guidelines] }))
      return guideline
    },
    [currentUser.id],
  )

  const updateGuideline = useCallback(async (id, payload) => {
    const existing = state.guidelines.find((guideline) => guideline.id === id)
    if (!existing) throw new Error('Guideline not found.')
    const updated = await updateGuidelineMock(existing, payload)
    setState((prev) => ({
      ...prev,
      guidelines: prev.guidelines.map((guideline) =>
        guideline.id === id ? updated : guideline,
      ),
    }))
    return updated
  }, [state.guidelines])

  const deleteGuideline = useCallback(async (id) => {
    await deleteGuidelineMock(id)
    setState((prev) => ({
      ...prev,
      guidelines: prev.guidelines.filter((guideline) => guideline.id !== id),
    }))
  }, [])

  const inviteMember = useCallback(async (payload) => {
    const member = await inviteMemberMock(payload)
    setState((prev) => ({ ...prev, team: [...prev.team, member] }))
    return member
  }, [])

  const updateMemberRole = useCallback(async (id, role) => {
    const member = state.team.find((item) => item.id === id)
    if (!member) throw new Error('Team member not found.')
    const updated = await changeMemberRole(member, role)
    setState((prev) => ({
      ...prev,
      team: prev.team.map((item) => (item.id === id ? updated : item)),
    }))
    return updated
  }, [state.team])

  const updateProfile = useCallback(
    (payload) => {
      setState((prev) => ({
        ...prev,
        team: prev.team.map((member) =>
          member.id === prev.currentUserId
            ? { ...member, ...payload, name: payload.name?.trim() || member.name }
            : member,
        ),
      }))
    },
    [],
  )

  const updateOrganisation = useCallback((payload) => {
    setState((prev) => ({ ...prev, organisation: { ...prev.organisation, ...payload } }))
  }, [])

  const switchCurrentRole = useCallback((nextRole) => {
    setState((prev) => ({
      ...prev,
      team: prev.team.map((member) =>
        member.id === prev.currentUserId ? { ...member, role: nextRole } : member,
      ),
    }))
  }, [])

  const markNotificationRead = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }))
  }, [])

  const updateNotificationPreferences = useCallback((preferences) => {
    setState((prev) => ({
      ...prev,
      notificationPreferences: {
        ...(prev.notificationPreferences ?? {}),
        ...preferences,
      },
    }))
  }, [])

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* no-op */
    }
    setState(createSeedState())
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      currentUser,
      role: currentUser?.role ?? 'Manager',
      isSubmitting,
      getUser,
      getGuideline,
      submitReview,
      updateFinding,
      addComment,
      sendForApproval,
      decideReview,
      addGuideline,
      updateGuideline,
      deleteGuideline,
      inviteMember,
      updateMemberRole,
      updateProfile,
      updateOrganisation,
      switchCurrentRole,
      markNotificationRead,
      markAllNotificationsRead,
      updateNotificationPreferences,
      resetDemo,
    }),
    [
      state,
      currentUser,
      isSubmitting,
      getUser,
      getGuideline,
      submitReview,
      updateFinding,
      addComment,
      sendForApproval,
      decideReview,
      addGuideline,
      updateGuideline,
      deleteGuideline,
      inviteMember,
      updateMemberRole,
      updateProfile,
      updateOrganisation,
      switchCurrentRole,
      markNotificationRead,
      markAllNotificationsRead,
      updateNotificationPreferences,
      resetDemo,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

