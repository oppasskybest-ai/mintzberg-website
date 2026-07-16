import { resolveHref } from '@/lib/assets'

export default function SmartLink({
  href,
  children,
  className,
  style,
}: {
  href: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const { href: resolved, external } = resolveHref(href)
  return (
    <a
      href={resolved}
      className={className}
      style={style}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
