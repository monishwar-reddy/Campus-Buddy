import { useState } from 'react'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  // ADD YOUR FORMSPREE URL HERE
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
      <form className="contact-form" onSubmit={handleSubmit}>
        <h1>📧 Contact Us</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>Have questions? We'd love to hear from you!</p>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
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
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here..."
            rows="6"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Send Message 🚀
        </button>

        {submitted && (
          <div className="success-message">
            ✅ Message sent successfully! We'll get back to you soon.
          </div>
        )}
      </form>
    </div>
  )
}

export default ContactUs
