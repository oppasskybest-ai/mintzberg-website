import FeatureBand from '@/components/layout/FeatureBand'
import WaveDivider from '@/components/layout/WaveDivider'
import { assetUrl } from '@/lib/assets'

// Verbatim from html/pages/1.html block-block-1 and block-block-3.
// Redesigned 2026-07-15: full-bleed real-photo band (a beaver sculpture
// close-up, one of Henry's own images) with navy overlay, replacing the
// flat paper section — per the cushnir-site reference pattern.
export default function IntroBlocks() {
  const bg = assetUrl('beaverm11.jpg')
  return (
    <>
      <WaveDivider fill="var(--navy)" />
      <FeatureBand imageUrl={bg} overlay="navy" style={{ padding: '4.5rem 0' }}>
      <div className="container-content" style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
        <div>
          <p className="hero-eyebrow" style={{ marginBottom: '0.5rem' }}>Reframing management</p>
          <h2 style={{ color: 'var(--paper)', margin: '0 0 0.9rem' }}>Blog</h2>
          <p style={{ color: 'rgba(250,250,248,0.85)' }}>
            This blog is about reframing management and lots more. It started
            as a TWOG (TWeet 2 blOG) but is now also a much LinkedIn 2 blog.
            Every few weeks, from pithy pronouncements in a line or few to
            playful provocations in a page or few. See the{' '}
            <a href="/blog" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>BLOGs</a>{' '}
            directly (now numbering over 200 posts), connect to them via{' '}
            <a href="https://ca.linkedin.com/in/henrymintzberg" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>LinkedIn</a>{' '}
            or <a href="https://twitter.com/Mintzberg141" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>twiXer</a>, or
            subscribe on <a href="/blog" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>MailChimp</a>.
          </p>
        </div>
        <div>
          <p className="hero-eyebrow" style={{ marginBottom: '0.5rem' }}>On video</p>
          <h2 style={{ color: 'var(--paper)', margin: '0 0 0.9rem' }}>Minutes with Mintzberg</h2>
          <p style={{ color: 'rgba(250,250,248,0.85)' }}>
            Over 40 short videos about reframing management, society, health
            care, and more, most excerpted from question &amp; answer events on
            Zoom. Connect on{' '}
            <a href="https://www.youtube.com/playlist?list=PLtiGzu7sz7w1zC7PdbspvLt0iQ99IxH1h" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>
              YouTube
            </a>
            , also see the rest of{' '}
            <a href="https://www.youtube.com/@Mintzberg141" style={{ color: 'var(--paper)', borderBottom: '1px solid var(--orange)' }}>my channel</a>{' '}
            there.
          </p>
        </div>
      </div>
    </FeatureBand>
    </>
  )
}
