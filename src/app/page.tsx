import Link from 'next/link'

const features = [
  { icon: '🏕️', title: 'Overnight Boarding', description: 'Safe, comfortable overnight stays with 24/7 supervision.' },
  { icon: '🌞', title: 'Daycare', description: 'Full-day play and socialisation while you\'re at work.' },
  { icon: '🛁', title: 'Grooming', description: 'Baths, brush-outs, and nail trims to keep coats gleaming.' },
  { icon: '🏃', title: 'Training', description: 'One-on-one sessions with certified positive-reinforcement trainers.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Navbar */}
      <nav className="bg-white border-b" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="cp-container flex items-center justify-between py-4">
          <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            🐾 Camp Pawesome
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Sign in
            </Link>
            <Link href="/signup" className="cp-btn-primary text-sm py-2 px-5">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="cp-container py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
          Premium Dog Boarding & Daycare
        </p>
        <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--color-brown)', lineHeight: 1.1 }}>
          Where dogs come to<br />play, rest & thrive
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--color-text-body)' }}>
          Camp Pawesome offers boarding, daycare, grooming, and training in a safe, stress-free environment your dog will love.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/signup" className="cp-btn-primary">Book a stay</Link>
          <Link href="#services" className="cp-btn-outline">Learn more</Link>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="cp-container pb-24">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
          Services
        </p>
        <h2 className="text-3xl font-bold mb-10" style={{ color: 'var(--color-brown)' }}>
          Everything your dog needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-xl p-8 border" style={{ borderColor: 'var(--color-border-light)' }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-brown)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ background: 'var(--color-brown)', color: 'white' }}>
        <div className="cp-container flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-bold text-lg">🐾 Camp Pawesome</span>
          <span className="text-sm opacity-70">© {new Date().getFullYear()} Camp Pawesome. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
