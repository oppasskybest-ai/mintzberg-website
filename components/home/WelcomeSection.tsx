import Image from 'next/image'
import { assetUrl } from '@/lib/assets'
import WaveDivider from '@/components/layout/WaveDivider'

// Verbatim from html/pages/1.html <div class="ds single page"> block.
// Rule 1: not one word of Henry's welcome text is altered.
// Redesigned 2026-07-15 with the premium hero-parallax treatment.
export default function WelcomeSection() {
  const portrait = assetUrl('mintzberg_portrait.jpg')
  const signature = assetUrl('signature.png')

  return (
    <>
      <section className="hero-parallax">
        <div
          className="container-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {portrait && (
            <Image
              src={portrait}
              alt="Henry Mintzberg"
              width={168}
              height={168}
              style={{
                width: '168px',
                height: '168px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid rgba(250,250,248,0.85)',
                marginBottom: '2rem',
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              }}
              priority
            />
          )}
          <p className="hero-eyebrow">Professor · Author · Henry Mintzberg</p>
          <h1 className="hero-title">Welcome</h1>
          <div className="divider-accent divider-accent-center" />
          <p className="hero-subtitle" style={{ margin: '0 auto', textAlign: 'left' }}>
            I have prepared this website in response to requests for
            information on my background and my activities. You can click
            to my articles, books, interviews, talks, and videos, as well
            as some personal interests (short stories, beaver sculptures).
            Also connect to several of the unusual programs that we have
            developed, also to my{' '}
            <a href="/blog" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>
              blog
            </a>
            , plus{' '}
            <a
              href="https://ca.linkedin.com/in/henrymintzberg"
              style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}
            >
              Linkedin
            </a>
            ,{' '}
            <a
              href="http://twitter.com/Mintzberg141"
              style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}
            >
              Twitter
            </a>
            , and{' '}
            <a
              href="/blog/subscribe"
              style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}
            >
              MailChimp
            </a>{' '}
            (direct).
          </p>
        </div>
      </section>

      <WaveDivider fill="var(--paper)" />

      <section className="container-content" style={{ padding: '2.5rem 1.25rem 0', textAlign: 'center' }}>
        {signature && (
          <Image
            src={signature}
            alt="Henry Mintzberg signature"
            width={180}
            height={72}
            style={{ height: 'auto', margin: '0 auto' }}
          />
        )}
        <p style={{ color: 'var(--ink-light)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
          (Website updated in April 2024)
        </p>
      </section>
    </>
  )
}
