import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: dogs } = await supabase
    .from('dogs')
    .select('id, name, breed, age_years, photo_url')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, status, dogs(name)')
    .eq('owner_id', user.id)
    .order('start_date', { ascending: false })
    .limit(5)

  const firstName = user.user_metadata?.first_name ?? user.email?.split('@')[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Navbar */}
      <nav className="bg-white border-b" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="cp-container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            🐾 Camp Pawesome
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--color-text-body)' }}>Hi, {firstName}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="cp-container py-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-brown)' }}>Dashboard</h1>

        {/* Dogs section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-brown)' }}>Your dogs</h2>
            <Link href="/dashboard/dogs/new" className="cp-btn-primary text-sm py-2 px-4">
              + Add dog
            </Link>
          </div>
          {!dogs || dogs.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border" style={{ borderColor: 'var(--color-border-light)' }}>
              <p className="text-4xl mb-3">🐶</p>
              <p className="font-medium mb-1" style={{ color: 'var(--color-brown)' }}>No dogs yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Add your first dog to get started with bookings.</p>
              <Link href="/dashboard/dogs/new" className="cp-btn-primary text-sm py-2 px-5">Add dog</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dogs.map(dog => (
                <div key={dog.id} className="bg-white rounded-xl p-5 border flex items-center gap-4" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {dog.photo_url ? (
                      <img src={dog.photo_url} alt={dog.name} className="w-full h-full rounded-full object-cover" />
                    ) : '🐾'}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-brown)' }}>{dog.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {[dog.breed, dog.age_years != null ? `${dog.age_years} yr${dog.age_years !== 1 ? 's' : ''}` : null].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent bookings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-brown)' }}>Recent bookings</h2>
            <Link href="/dashboard/bookings/new" className="cp-btn-outline text-sm py-2 px-4">
              New booking
            </Link>
          </div>
          {!bookings || bookings.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border" style={{ borderColor: 'var(--color-border-light)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No bookings yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border-light)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border-light)', background: 'var(--color-cream)' }}>
                    <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--color-brown)' }}>Dog</th>
                    <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--color-brown)' }}>Dates</th>
                    <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--color-brown)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b last:border-0" style={{ borderColor: 'var(--color-border-light)' }}>
                      <td className="px-5 py-3" style={{ color: 'var(--color-text-body)' }}>
                        {(b.dogs as any)?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--color-text-body)' }}>
                        {b.start_date} → {b.end_date}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
