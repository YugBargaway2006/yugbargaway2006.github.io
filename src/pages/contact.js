import React, { useState, useRef } from 'react'
import Helmet from 'react-helmet'

import { Layout } from '../components/Layout'
import { PageLayout } from '../components/PageLayout'
import { Hero } from '../components/Hero'
import { SEO } from '../components/SEO'
import { Mail } from '../assets/Mail'
import { GitHub } from '../assets/GitHub'
import { LinkedIn } from '../assets/LinkedIn'
import { FloatingHogwartsLetter } from '../components/FloatingHogwartsLetter'
import { ConstellationCanvas } from '../components/ConstellationCanvas'
import contactIcon from '../assets/nav-contact.png'
import config from '../utils/config'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [isFlooVanishing, setIsFlooVanishing] = useState(false)
  const formCardRef = useRef(null)

  const title = 'Contact'
  const description =
    'Whether you have a project in mind, a question, or just want to say hi, send a post via the magical network.'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('sending')

    try {
      const WEB3FORMS_KEY = 'b8c28458-034f-432b-b210-8a7ad470edaa'

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          message,
          subject: `New message from ${name} via Website`,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setSubmitStatus('error')
        setIsSubmitting(false)
        return
      }

      // Floo Network vanish animation
      setIsFlooVanishing(true)
      setTimeout(() => {
        setSubmitStatus('success')
        setIsFlooVanishing(false)
        setName('')
        setEmail('')
        setMessage('')
      }, 1000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet title={`${title} | ${config.siteTitle}`} />
      <SEO customTitle={title} customDescription={description} />

      <PageLayout>
        <Hero title={title} description={description} icon={contactIcon} />

        <div className="contact-container">
          <ConstellationCanvas />

          <div className="contact-grid">
            {/* Left Column: Info & Links */}
            <div className="contact-info">
              <h2 className="contact-title">Connect with me</h2>
              <p className="contact-description">
                Whether you have a project in mind, a question about my spells,
                or just want to say hi, I&apos;m always open to new connections.
              </p>

              <div className="contact-links-list">
                <a
                  href="mailto:bargawayyug@gmail.com"
                  className="contact-link-card interactive-card"
                >
                  <div className="contact-icon-bubble">
                    <Mail size={20} />
                  </div>
                  <div>
                    bargawayyug <span className="opacity-60">[at]</span> gmail{' '}
                    <span className="opacity-60">[dot]</span> com
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/yugbargaway"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-card interactive-card"
                >
                  <div className="contact-icon-bubble">
                    <LinkedIn size={20} />
                  </div>
                  <div>LinkedIn</div>
                </a>

                <a
                  href="https://github.com/yugbargaway2006"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-card interactive-card"
                >
                  <div className="contact-icon-bubble">
                    <GitHub size={20} />
                  </div>
                  <div>GitHub</div>
                </a>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="contact-form-container">
              <div
                ref={formCardRef}
                className={`contact-form-card interactive-card ${
                  isFlooVanishing ? 'floo-vanish' : ''
                }`}
              >
                {submitStatus === 'success' ? (
                  <div className="contact-success-box">
                    <div className="contact-success-icon">📮✨</div>
                    <h3 className="contact-success-title">Message Sent!</h3>
                    <p className="contact-success-text">
                      Your message is on its way. I&apos;ll respond soon!
                    </p>
                    <button
                      type="button"
                      className="button"
                      style={{ marginTop: '1.5rem' }}
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="contact-input"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="contact-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        className="contact-textarea"
                        placeholder="How can I help you?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      className="contact-submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending Post...' : 'Send Post 📬'}
                    </button>

                    {submitStatus === 'error' && (
                      <p className="contact-error-text">
                        Oops! The owl got lost. Please try again.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Flying Hogwarts Letter Animation */}
        <FloatingHogwartsLetter />
      </PageLayout>
    </>
  )
}

Contact.Layout = Layout
