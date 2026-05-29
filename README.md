# Customer Support CRM System

A full-stack web application for managing customer support tickets built for the Datastraw Assessment.

## 🔗 Live Demo
- **Frontend:** https://crm-project-seven-iota.vercel.app
- **Backend API:** https://crm-project-production-7bdf.up.railway.app/docs

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Python + FastAPI |
| Database | SQLite + SQLAlchemy |
| Frontend | React + Vite |
| Deployment | Railway (backend) + Vercel (frontend) |

## ✨ Features
- ✅ Create tickets with customer info, auto-generated ID and timestamp
- ✅ List all tickets with ID, name, subject, status and date
- ✅ Search across name, email, ticket ID and subject
- ✅ Filter by status — Open, In Progress, Closed
- ✅ View ticket details, update status and add notes

## 📁 Project Structure
crm-project/
├── backend/
│   ├── main.py         # FastAPI routes (4 endpoints)
│   ├── database.py     # SQLAlchemy models
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── pages/
│           ├── TicketList.jsx
│           ├── CreateTicket.jsx
│           └── TicketDetail.jsx
└── README.md

## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

## 🔌 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tickets | Create a new ticket |
| GET | /api/tickets | List all tickets |
| GET | /api/tickets/{id} | Get ticket details |
| PUT | /api/tickets/{id} | Update ticket status/notes |

## 👨‍💻 Built By
Rohan Bhosale — Datastraw Internship Assessment