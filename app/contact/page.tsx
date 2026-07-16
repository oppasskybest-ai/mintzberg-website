import PageHero from '@/components/layout/PageHero'
import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Get in touch" title="Contact" compact />
      <section className="container-content" style={{ padding: '3rem 1.25rem 4.5rem' }}>
        <ContactForm />
      </section>
    </main>
  )
}
