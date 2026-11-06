import { delay } from './api'

/**
 * Demonstration authentication service.
 * Nothing is verified and no credentials are stored or transmitted.
 */
export const DEMO_CREDENTIALS = {
  email: 'maya.chen@northwind.co',
  password: 'truthnuke',
}

export async function mockLogin({ email }) {
  await delay(900)
  if (!email) throw new Error('Email is required.')
  return {
    token: 'demo-token-not-a-real-session',
    user: {
      name: 'Maya Chen',
      email,
      role: 'Manager',
    },
  }
}

export async function mockRegister({ name, email }) {
  await delay(1000)
  if (!name || !email) throw new Error('Name and email are required.')
  return {
    token: 'demo-token-not-a-real-session',
    user: { name, email, role: 'Creator' },
  }
}
