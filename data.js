/**
 * Simple file-based data store for tickets.
 * Uses a JSON file instead of a real database to keep the project easy to
 * run and inspect -- swap this out for MongoDB (you already know Mongoose
 * from the School ERP project) if you want to extend this further.
 */
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "tickets.json");

function readTickets() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTickets(tickets) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));
}

module.exports = { readTickets, writeTickets };
