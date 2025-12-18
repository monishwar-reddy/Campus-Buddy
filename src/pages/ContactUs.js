import { useState } from 'react'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const FORMSPREE_URL = 'https://formspree.io/f/mzzyrake'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      alert('Error sending message. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact-page">
      {/* 1. Page Background & Overlay - Using Public Image */}
      <div className="page-background" style={{ backgroundImage: 'url(/images/contact-bg.png)' }}></div>
      <div className="page-overlay"></div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h1 style={{ fontFamily: "'Mountains of Christmas', cursive", fontSize: '3rem', color: '#ffd700' }}>
          📧 Send a Gift Message
        </h1>
        <p style={{ marginBottom: '2rem', color: '#e0e0e0' }}>Have questions? We'd love to hear from you!</p>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', width: '100%' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', width: '100%' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700' }}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your festive message here..."
            rows="5"
            required
            style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', width: '100%', resize: 'none' }}
          />
        </div>

        <button type="submit" className="btn-christmas-premium" style={{ width: '100%', border: 'none' }}>
          SEND MESSAGE ✨
        </button>

        {submitted && (
          <div className="success-message" style={{ marginTop: '1.5rem', color: '#00ff00', textAlign: 'center' }}>
            ✅ Message sent successfully! 🎄
          </div>
        )}
      </form>
    </div>
  )
}

export default ContactUs
