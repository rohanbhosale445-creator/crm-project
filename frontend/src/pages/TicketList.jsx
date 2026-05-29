import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://crm-project-production-7bdf.up.railway.app'

export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const navigate = useNavigate()

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    const res = await axios.get(`${API}/api/tickets`)
    setTickets(res.data)
  }

  const filtered = tickets.filter(t => {
    const matchSearch = t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'All' || t.status === status
    return matchSearch && matchStatus
  })

  const statusColor = (s) => {
    if (s === 'Open') return '#16a34a'
    if (s === 'In Progress') return '#d97706'
    return '#6b7280'
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Support Tickets</h1>
        <button onClick={() => navigate('/create')}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600 }}>
          + New Ticket
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Search by name, email, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}
        />
        {['All', 'Open', 'In Progress', 'Closed'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #d1d5db',
              background: status === s ? '#2563eb' : 'white',
              color: status === s ? 'white' : '#374151', fontWeight: 500 }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Ticket ID', 'Customer', 'Subject', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No tickets found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.ticket_id} onClick={() => navigate(`/ticket/${t.ticket_id}`)}
                style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{t.ticket_id}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500 }}>{t.customer_name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{t.customer_email}</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>{t.subject}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: statusColor(t.status) + '20', color: statusColor(t.status),
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}