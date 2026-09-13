/**
 * Ticket Tracker - REST API
 * --------------------------
 * A simple support ticket tracking system: create, view, update status,
 * and resolve tickets. Modeled loosely on how a Service Desk / ITSM tool
 * (like Jira Service Management or ServiceNow) tracks incidents.
 */
const express = require("express");
const path = require("path");
const { readTickets, writeTickets } = require("./data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const VALID_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"];

function generateId(tickets) {
  return tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;
}

// GET all tickets (supports optional ?status= and ?priority= filters)
app.get("/api/tickets", (req, res) => {
  let tickets = readTickets();
  const { status, priority } = req.query;

  if (status) {
    tickets = tickets.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }
  if (priority) {
    tickets = tickets.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
  }

  res.json(tickets);
});

// GET a single ticket by id
app.get("/api/tickets/:id", (req, res) => {
  const tickets = readTickets();
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

// POST create a new ticket
app.post("/api/tickets", (req, res) => {
  const { title, description, priority, assignee } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "title and description are required" });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
  }

  const tickets = readTickets();
  const newTicket = {
    id: generateId(tickets),
    title,
    description,
    status: "Open",
    priority: priority || "Medium",
    assignee: assignee || "Unassigned",
    resolutionNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tickets.push(newTicket);
  writeTickets(tickets);
  res.status(201).json(newTicket);
});

// PATCH update a ticket (status, priority, assignee, resolution notes)
app.patch("/api/tickets/:id", (req, res) => {
  const tickets = readTickets();
  const ticket = tickets.find((t) => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const { status, priority, assignee, resolutionNotes } = req.body;

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` });
    }
    ticket.status = status;
  }
  if (priority) {
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(", ")}` });
    }
    ticket.priority = priority;
  }
  if (assignee) ticket.assignee = assignee;
  if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;

  ticket.updatedAt = new Date().toISOString();
  writeTickets(tickets);
  res.json(ticket);
});

// DELETE a ticket
app.delete("/api/tickets/:id", (req, res) => {
  let tickets = readTickets();
  const exists = tickets.some((t) => t.id === parseInt(req.params.id));
  if (!exists) return res.status(404).json({ error: "Ticket not found" });

  tickets = tickets.filter((t) => t.id !== parseInt(req.params.id));
  writeTickets(tickets);
  res.status(204).send();
});

// GET simple stats (useful for a support-team dashboard)
app.get("/api/stats", (req, res) => {
  const tickets = readTickets();
  const stats = {
    total: tickets.length,
    byStatus: {},
    byPriority: {},
  };
  VALID_STATUSES.forEach((s) => (stats.byStatus[s] = tickets.filter((t) => t.status === s).length));
  VALID_PRIORITIES.forEach((p) => (stats.byPriority[p] = tickets.filter((t) => t.priority === p).length));
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Ticket Tracker API running at http://localhost:${PORT}`);
});
