export default function PageHero({
  eyebrow,
  title,
  subtitle,
  compact = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  compact?: boolean
}) {
  return (
    <section
      className="hero-parallax"
      style={compact ? { minHeight: '38vh' } : undefined}
    >
      <div className="container-content" style={{ textAlign: 'center' }}>
        {eyebrow && <p className="hero-eyebrow">{eyebrow}</p>}
        <h1 className="hero-title">{title}</h1>
        <div className="divider-accent divider-accent-center" />
        {subtitle && <p className="hero-subtitle" style={{ margin: '0 auto' }}>{subtitle}</p>}
      </div>
    </section>
  )
}
