from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import database
import random
import string

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_ticket_id():
    numbers = ''.join(random.choices(string.digits, k=4))
    return f"TKT-{numbers}"

class TicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    note: Optional[str] = None

@app.get("/")
def root():
    return {"message": "CRM API is running!"}

@app.post("/api/tickets")
def create_ticket(ticket: TicketCreate, db: Session = Depends(database.get_db)):
    ticket_id = generate_ticket_id()
    db_ticket = database.Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return {"ticket_id": ticket_id, "created_at": db_ticket.created_at}

@app.get("/api/tickets")
def get_tickets(status: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(database.Ticket)
    if status:
        query = query.filter(database.Ticket.status == status)
    if search:
        query = query.filter(
            database.Ticket.customer_name.contains(search) |
            database.Ticket.customer_email.contains(search) |
            database.Ticket.ticket_id.contains(search) |
            database.Ticket.subject.contains(search)
        )
    tickets = query.order_by(database.Ticket.created_at.desc()).all()
    return tickets

@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: str, db: Session = Depends(database.get_db)):
    ticket = db.query(database.Ticket).filter(database.Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    notes = db.query(database.Note).filter(database.Note.ticket_id == ticket_id).all()
    return {
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "notes": notes
    }

@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, update: TicketUpdate, db: Session = Depends(database.get_db)):
    ticket = db.query(database.Ticket).filter(database.Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if update.status:
        ticket.status = update.status
    ticket.updated_at = datetime.utcnow()
    if update.note:
        db_note = database.Note(ticket_id=ticket_id, note_text=update.note)
        db.add(db_note)
    db.commit()
    return {"success": True, "updated_at": ticket.updated_at}