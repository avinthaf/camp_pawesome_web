'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-cream)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            🐾 Camp Pawesome
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-body)' }}>Sign in to your account</p>
        </div>

        <div className="cp-card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-brown)' }}>
                Email
              </label>
              <input name="email" type="email" required className="cp-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-brown)' }}>
                Password
              </label>
              <input name="password" type="password" required className="cp-input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="cp-btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: 'var(--color-primary)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
