import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = 'https://crm-project-production-7bdf.up.railway.app'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchTicket() }, [])

  const fetchTicket = async () => {
    const res = await axios.get(`${API}/api/tickets/${id}`)
    setTicket(res.data)
    setStatus(res.data.status)
  }

  const handleUpdate = async () => {
    setLoading(true)
    await axios.put(`${API}/api/tickets/${id}`, { status, note })
    setNote('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    fetchTicket()
    setLoading(false)
  }

  const statusColor = (s) => {
    if (s === 'Open') return '#16a34a'
    if (s === 'In Progress') return '#d97706'
    return '#6b7280'
  }

  if (!ticket) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading...</div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <button onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 14, marginBottom: 16 }}>
        ← Back to tickets
      </button>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>{ticket.ticket_id}</span>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{ticket.subject}</h1>
          </div>
          <span style={{ background: statusColor(ticket.status) + '20', color: statusColor(ticket.status),
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{ticket.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Customer Name</div>
            <div style={{ fontWeight: 500 }}>{ticket.customer_name}</div>
          </div>
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Email</div>
            <div style={{ fontWeight: 500 }}>{ticket.customer_email}</div>
          </div>
        </div>

        <div style={{ background: '#f9fafb', padding: 14, borderRadius: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Description</div>
          <div style={{ lineHeight: 1.6 }}>{ticket.description}</div>
        </div>

        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          Created: {new Date(ticket.created_at).toLocaleString()}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Update Ticket</h2>

        {success && (
          <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            ✓ Ticket updated successfully!
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, marginTop: 6 }}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Add Note</label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add a note or comment..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db',
              fontSize: 14, marginTop: 6, height: 100, resize: 'vertical' }} />
        </div>

        <button onClick={handleUpdate} disabled={loading}
          style={{ background: loading ? '#93c5fd' : '#2563eb', color: 'white',
            border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {ticket.notes && ticket.notes.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Notes History</h2>
          {ticket.notes.map((n, i) => (
            <div key={i} style={{ background: '#f9fafb', padding: 14, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>{n.note_text}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                {new Date(n.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}