import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://crm-project-production-7bdf.up.railway.app'

export default function CreateTicket() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.customer_name || !form.customer_email || !form.subject || !form.description) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API}/api/tickets`, form)
      navigate('/')
    } catch (err) {
      setError('Failed to create ticket. Try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, marginTop: 6
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <button onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 14, marginBottom: 16 }}>
        ← Back to tickets
      </button>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Create New Ticket</h1>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Customer Name</label>
          <input style={inputStyle} placeholder="John Doe"
            value={form.customer_name}
            onChange={e => setForm({ ...form, customer_name: e.target.value })} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Customer Email</label>
          <input style={inputStyle} placeholder="john@example.com" type="email"
            value={form.customer_email}
            onChange={e => setForm({ ...form, customer_email: e.target.value })} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Subject</label>
          <input style={inputStyle} placeholder="Brief description of the issue"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Description</label>
          <textarea style={{ ...inputStyle, height: 120, resize: 'vertical' }}
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', background: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', padding: '12px', borderRadius: 8,
            fontSize: 15, fontWeight: 600 }}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </div>
  )
}