"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const VALID_PASSWORD = process.env.ADMIN_PASSWORD || "movoit"
const SESSION_COOKIE_NAME = 'supplier_admin_session'

export async function authenticate(password: string): Promise<{ success: boolean; error?: string }> {
  if (password !== VALID_PASSWORD) {
    return { success: false, error: "Forkert adgangskode" }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect('/login')
}
