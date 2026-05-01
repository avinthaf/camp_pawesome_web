import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NewDogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName = user.user_metadata?.first_name ?? user.email?.split('@')[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      <nav className="bg-white border-b" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="cp-container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            🐾 Camp Pawesome
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--color-text-body)' }}>Hi, {firstName}</span>
            <Link href="/dashboard" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="cp-container py-12">
        <div className="max-w-xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm mb-8 hover:underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ← Back to dashboard
          </Link>

          <div className="cp-card text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-brown)' }}>
              Register a new dog
            </h1>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Online self-registration is coming soon! For now, we handle all new dog registrations personally so we can get the details just right.
            </p>

            <div
              className="rounded-xl p-6 mb-8 text-left space-y-5"
              style={{ background: 'var(--color-cream)', border: '1px solid var(--color-border-light)' }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-brown)' }}>
                How to register
              </p>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                  style={{ background: '#FFEDD5' }}
                >
                  📞
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-brown)' }}>Call us</p>
                  <a
                    href="tel:+15551234567"
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    (555) 123-4567
                  </a>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Mon–Fri, 8 am – 6 pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                  style={{ background: '#FFEDD5' }}
                >
                  ✉️
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-brown)' }}>Email us</p>
                  <a
                    href="mailto:hello@camppawesome.com"
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    hello@camppawesome.com
                  </a>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    We reply within one business day
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-4 text-left"
              style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-brown)' }}>
                What to have ready
              </p>
              <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-body)' }}>
                <li>· Your dog's name, breed, age, and weight</li>
                <li>· Vaccination records (rabies, Bordetella, DHPP)</li>
                <li>· Any known allergies or medical conditions</li>
                <li>· Your vet's contact information</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
