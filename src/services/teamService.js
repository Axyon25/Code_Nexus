import { delay, makeId } from './api'

/**
 * Mock team service. Invitations are local only and never sent by email.
 */
export async function inviteMember({ name, email, role }) {
  await delay(700)
  return {
    id: makeId('member'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    title: role === 'Reviewer' ? 'Reviewer' : role === 'Creator' ? 'Content creator' : 'Manager',
    avatarTone: ['blue', 'violet', 'teal', 'amber', 'rose', 'emerald'][
      Math.floor(Math.random() * 6)
    ],
    status: 'invited',
    location: 'Remote',
    joinedAt: new Date().toISOString(),
    lastActive: null,
  }
}

export async function changeMemberRole(member, role) {
  await delay(350)
  return { ...member, role }
}
