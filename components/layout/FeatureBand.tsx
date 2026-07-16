export default function FeatureBand({
  imageUrl,
  overlay = 'navy',
  children,
  style,
}: {
  imageUrl: string | null
  overlay?: 'navy' | 'light'
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`feature-band feature-band-overlay-${overlay}`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundColor: imageUrl ? undefined : overlay === 'navy' ? 'var(--navy)' : 'var(--paper-alt)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
