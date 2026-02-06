const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const PRODUCTS_FILE = path.join(__dirname, "data/products.json");
const USERS_FILE = path.join(__dirname, "data/users.json");
const ORDERS_FILE = path.join(__dirname, "data/orders.json");

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------------- PRODUCTS ---------------- */
app.get("/api/products", (req, res) => {
  res.json(readJSON(PRODUCTS_FILE));
});

app.get("/api/products/:id", (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find(p => p.id == req.params.id);
  res.json(product);
});

/* ---------------- USERS ---------------- */
app.post("/api/signup", (req, res) => {
  const users = readJSON(USERS_FILE);
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });
  writeJSON(USERS_FILE, users);

  res.json({ message: "Signup successful" });
});

app.post("/api/login", (req, res) => {
  const users = readJSON(USERS_FILE);
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

/* ---------------- ORDERS ---------------- */
app.post("/api/order", (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  orders.push(req.body);
  writeJSON(ORDERS_FILE, orders);
  res.json({ message: "Order placed successfully" });
});

/* ---------------- CONTACT ---------------- */
app.post("/api/contact", (req, res) => {
  console.log("Contact Form:", req.body);
  res.json({ message: "Message received" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://192.168.1.6/api:`);
});

