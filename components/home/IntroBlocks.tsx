// Verbatim from html/pages/1.html block-block-1 and block-block-3.
// Wrapped in the fixed-texture section-parallax band so the background
// stays "featured" while scrolling, per the premium design direction.
export default function IntroBlocks() {
  return (
    <section className="section-parallax" style={{ padding: '3.5rem 0' }}>
      <div className="container-content" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div>
          <p className="eyebrow-label">Reframing management</p>
          <h2 style={{ margin: '0.4rem 0 0.9rem' }}>Blog</h2>
          <p>
            This blog is about reframing management and lots more. It started
            as a TWOG (TWeet 2 blOG) but is now also a much LinkedIn 2 blog.
            Every few weeks, from pithy pronouncements in a line or few to
            playful provocations in a page or few. See the{' '}
            <a href="/blog">BLOGs</a> directly (now numbering over 200 posts),
            connect to them via{' '}
            <a href="https://ca.linkedin.com/in/henrymintzberg">LinkedIn</a>{' '}
            or <a href="https://twitter.com/Mintzberg141">twiXer</a>, or
            subscribe on <a href="/blog">MailChimp</a>.
          </p>
        </div>
        <div>
          <p className="eyebrow-label">On video</p>
          <h2 style={{ margin: '0.4rem 0 0.9rem' }}>Minutes with Mintzberg</h2>
          <p>
            Over 40 short videos about reframing management, society, health
            care, and more, most excerpted from question &amp; answer events on
            Zoom. Connect on{' '}
            <a href="https://www.youtube.com/playlist?list=PLtiGzu7sz7w1zC7PdbspvLt0iQ99IxH1h">
              YouTube
            </a>
            , also see the rest of{' '}
            <a href="https://www.youtube.com/@Mintzberg141">my channel</a>{' '}
            there.
          </p>
        </div>
      </div>
    </section>
  )
}
