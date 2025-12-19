import { useState } from 'react'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
        setFormData({ name: '', email: '', message: '' })
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
      <div className="page-background" style={{ backgroundImage: 'url(/images/contact-bg.png)' }}></div>
      <div className="page-overlay"></div>

      <div className="container relative-z" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="contact-form-container">
          <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-envelope-open-text"></i> Send a Gift Message
          </h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Have questions? We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="festive-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="festive-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                className="festive-input"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your festive message here..."
                rows="5"
                required
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-christmas-premium">
              SEND MESSAGE <i className="fas fa-paper-plane"></i>
            </button>

            {submitted && (
              <div className="success-message" style={{ marginTop: '2rem', color: '#ffd700', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <i className="fas fa-check-circle"></i> Message sent successfully! 🎄
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
