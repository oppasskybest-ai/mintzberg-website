import Image from 'next/image'
import { assetUrl } from '@/lib/assets'

// Verbatim from html/pages/1.html <div class="ds single page"> block.
// Rule 1: not one word of Henry's welcome text is altered.
export default function WelcomeSection() {
  const portrait = assetUrl('mintzberg_portrait.jpg')
  const signature = assetUrl('signature.png')

  return (
    <section className="container-content" style={{ paddingTop: '3rem' }}>
      {portrait && (
        <Image
          src={portrait}
          alt="Henry Mintzberg"
          width={280}
          height={280}
          style={{ height: 'auto', marginBottom: '1.5rem' }}
          priority
        />
      )}
      <h1>Welcome</h1>
      <p>
        I have prepared this website in response to requests for information
        on my background and my activities. You can click to my articles,
        books, interviews, talks, and videos, as well as some personal
        interests (short stories, beaver sculptures). Also connect to several
        of the unusual programs that we have developed, also to my{' '}
        <a href="/blog">blog</a>, plus{' '}
        <a href="https://ca.linkedin.com/in/henrymintzberg">Linkedin</a>,{' '}
        <a href="http://twitter.com/Mintzberg141">Twitter</a>, and{' '}
        <a href="/blog/subscribe">MailChimp</a> (direct).
      </p>
      {signature && (
        <Image
          src={signature}
          alt="Henry Mintzberg signature"
          width={200}
          height={80}
          style={{ height: 'auto', margin: '1rem 0' }}
        />
      )}
      <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem' }}>
        (Website updated in April 2024)
      </p>
    </section>
  )
}
