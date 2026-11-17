import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getPortfolioContent, submitContactMessage } from './api'
import type { PortfolioContent } from './api'
import './App.css'

function App() {
  const [content, setContent] = useState<PortfolioContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [contactStatus, setContactStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadContent() {
      setLoading(true)
      setLoadError('')

      try {
        const portfolioContent = await getPortfolioContent(controller.signal)
        setContent(portfolioContent)
      } catch {
        if (!controller.signal.aborted) {
          setLoadError('Portfolio content could not be loaded. Check that the backend is running, then try again.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadContent()
    return () => controller.abort()
  }, [retry])

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setContactStatus(null)

    try {
      await submitContactMessage(contact)
      setContact({ name: '', email: '', message: '' })
      setContactStatus({ type: 'success', text: 'Thanks for reaching out. Your message has been received.' })
    } catch {
      setContactStatus({
        type: 'error',
        text: 'Your message could not be sent. Please try again in a little while.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Orinea Tovhakale home">
          OT<span>.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a className="nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {content ? `${content.profile.name} · ${content.profile.title}` : 'SOFTWARE DEVELOPMENT · DATA SCIENCE'}
            </p>
            <h1>Building with purpose.<br /><span>Thinking in data.</span></h1>
            {loading && <p className="content-note" role="status">Loading portfolio…</p>}
            {loadError && (
              <div className="content-error" role="alert">
                <p>{loadError}</p>
                <button className="text-button" onClick={() => setRetry((current) => current + 1)} type="button">
                  Try again <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
            {content && (
              <>
                <p className="hero-tagline">{content.profile.tagline}</p>
                <p className="hero-summary">{content.profile.biography.split('\n\n')[0]}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
                  <a className="button button-quiet" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
                </div>
              </>
            )}
          </div>
          <div className="hero-aside" aria-label="Areas of focus">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <div className="monogram">OT</div>
            <div className="focus-card">
              <span className="focus-index">01 / FOCUS</span>
              <p>Software<br />&amp; data</p>
              <span className="focus-line" />
            </div>
            <span className="hero-coordinate">SOUTH AFRICA · 2026</span>
          </div>
        </section>

        <div className="section-rule"><span>01</span><span>THE PERSON BEHIND THE WORK</span></div>
        <section className="about section-shell" id="about">
          <div className="section-heading">
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <h2>Curiosity is where<br />good work begins.</h2>
          </div>
          <div className="about-copy">
            {content?.profile.biography.split('\n\n').slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {!content && !loadError && <p className="content-note">Loading my story…</p>}
          </div>
        </section>

        <div className="section-rule"><span>02</span><span>SELECTED WORK</span></div>
        <section className="work section-shell" id="work">
          <div className="work-intro">
            <div>
              <p className="eyebrow">A SELECTION OF WHAT I’VE BUILT</p>
              <h2>Work that works<br />in the real world.</h2>
            </div>
            <p className="work-note">Thoughtful digital experiences, built to solve real problems and create lasting value.</p>
          </div>

          <div className="project-list">
            {content?.projects.map((project, index) => (
              <article className="project-card" key={project.name}>
                <div className="project-number">0{index + 1}</div>
                <div className="project-main">
                  <div className="project-title-row">
                    <h3>{project.name}</h3>
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name} website`}>
                      ↗
                    </a>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <p className="project-role">{project.role}</p>
                  <ul className="tag-list" aria-label="Technologies">
                    {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
                <div className="project-contributions">
                  <span className="eyebrow">MY CONTRIBUTION</span>
                  <ul>
                    {project.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
                  </ul>
                </div>
              </article>
            ))}
            {!loading && !loadError && content?.projects.length === 0 && (
              <p className="content-note">More projects are on the way.</p>
            )}
          </div>
        </section>

        <div className="section-rule"><span>03</span><span>START A CONVERSATION</span></div>
        <section className="contact section-shell" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">HAVE A GOOD ONE IN MIND?</p>
            <h2>Let’s make<br />something matter.</h2>
            <p>I’m always open to thoughtful conversations, interesting problems, and opportunities to make a positive impact.</p>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>
              Your name
              <input
                autoComplete="name"
                maxLength={100}
                name="name"
                onChange={(event) => setContact({ ...contact, name: event.target.value })}
                required
                value={contact.name}
              />
            </label>
            <label>
              Email address
              <input
                autoComplete="email"
                maxLength={254}
                name="email"
                onChange={(event) => setContact({ ...contact, email: event.target.value })}
                required
                type="email"
                value={contact.email}
              />
            </label>
            <label>
              What’s on your mind?
              <textarea
                maxLength={5000}
                minLength={10}
                name="message"
                onChange={(event) => setContact({ ...contact, message: event.target.value })}
                required
                rows={4}
                value={contact.message}
              />
            </label>
            <div className="form-footer">
              <button className="button button-primary" disabled={sending} type="submit">
                {sending ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
              </button>
              {contactStatus && (
                <p className={`form-status ${contactStatus.type}`} role="status">{contactStatus.text}</p>
              )}
            </div>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#home">OT<span>.</span></a>
        <p>Building technology. Understanding data. Creating impact.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  )
}

export default App
