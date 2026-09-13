# Ticket Tracker

A simple support ticket / incident tracking web app with a REST API backend
and a lightweight frontend — modeled loosely on how tools like Jira Service
Management or ServiceNow track incidents from creation to resolution.

## Why I built this

Application support roles revolve around logging, tracking, and resolving
issues in a structured way. I built this to practice that exact workflow:
create a ticket, assign priority and an owner, move it through a status
lifecycle (Open → In Progress → Resolved → Closed), and track resolution
notes — the core loop behind incident management.

## Features

- Full CRUD REST API for tickets (Create, Read, Update, Delete)
- Ticket fields: title, description, status, priority, assignee, resolution notes, timestamps
- Status lifecycle: Open, In Progress, Resolved, Closed
- Priority levels: Low, Medium, High, Critical
- Filter tickets by status and/or priority via query params
- Live stats endpoint (total tickets, breakdown by status/priority) — useful
  for a support-team style dashboard
- Simple, functional frontend to create tickets and update their status
  without needing a separate API client

## Tech stack

- **Backend:** Node.js + Express
- **Storage:** JSON file (kept simple to run with zero setup — see note
  below on swapping in MongoDB)
- **Frontend:** Plain HTML/CSS/JavaScript (fetch API, no framework needed
  for a project this size)

## How to run it

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## API Endpoints

| Method | Endpoint             | Description                          |
|--------|----------------------|---------------------------------------|
| GET    | /api/tickets         | List all tickets (supports ?status=, ?priority= filters) |
| GET    | /api/tickets/:id     | Get a single ticket                  |
| POST   | /api/tickets         | Create a new ticket                  |
| PATCH  | /api/tickets/:id     | Update status/priority/assignee/notes |
| DELETE | /api/tickets/:id     | Delete a ticket                      |
| GET    | /api/stats           | Get ticket counts by status/priority |

### Example: creating a ticket via curl
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Login page 500 error","description":"Users unable to login","priority":"Critical","assignee":"Rohan Raj"}'
```

## Possible next steps (if extending this)

- Swap the JSON file for MongoDB + Mongoose (same pattern as the School ERP project)
- Add user authentication so tickets are tied to a logged-in agent
- Add comments/activity log per ticket
- Add email/Slack notification when a Critical ticket is created
