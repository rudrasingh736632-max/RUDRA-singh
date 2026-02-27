import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./src/db.js";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Auth
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    const result = stmt.run(email, hashedPassword);
    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, email, credits: 30, subscription_tier: 'free' } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, credits: user.credits, is_admin: user.is_admin, subscription_tier: user.subscription_tier } });
});

app.get("/api/user/me", authenticateToken, (req: any, res) => {
  const user: any = db.prepare("SELECT id, email, credits, is_admin, subscription_tier FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

app.post("/api/user/upgrade", authenticateToken, (req: any, res) => {
  const { plan } = req.body; // e.g., 'pro'
  db.prepare("UPDATE users SET subscription_tier = ?, credits = credits + 500 WHERE id = ?").run(plan, req.user.id);
  const user: any = db.prepare("SELECT id, email, credits, is_admin, subscription_tier FROM users WHERE id = ?").get(req.user.id);
  res.json({ success: true, user });
});

// AI Endpoints (Proxied to Gemini on Client or Server)
// Note: We'll mostly handle AI calls on the client for direct Gemini SDK usage, 
// but we need the server to track credits and history.

app.post("/api/generations/track", authenticateToken, (req: any, res) => {
  const { type, prompt, result_url, credits_used } = req.body;
  
  const user: any = db.prepare("SELECT credits FROM users WHERE id = ?").get(req.user.id);
  if (user.credits < credits_used) {
    return res.status(402).json({ error: "Insufficient credits" });
  }

  db.prepare("UPDATE users SET credits = credits - ? WHERE id = ?").run(credits_used, req.user.id);
  db.prepare("INSERT INTO generations (user_id, type, prompt, result_url, credits_used) VALUES (?, ?, ?, ?, ?)")
    .run(req.user.id, type, prompt, result_url, credits_used);

  res.json({ success: true, remaining_credits: user.credits - credits_used });
});

app.get("/api/generations/history", authenticateToken, (req: any, res) => {
  const history = db.prepare("SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
  res.json(history);
});

// Admin
app.get("/api/admin/settings", (req, res) => {
  const settings = db.prepare("SELECT * FROM site_settings").all();
  const settingsObj = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(settingsObj);
});

app.get("/api/admin/users", authenticateToken, (req: any, res) => {
  if (!req.user.is_admin) return res.sendStatus(403);
  const users = db.prepare("SELECT id, email, credits, is_admin, subscription_tier, created_at FROM users ORDER BY created_at DESC").all();
  res.json(users);
});

app.post("/api/admin/settings", authenticateToken, (req: any, res) => {
  if (!req.user.is_admin) return res.sendStatus(403);
  const updates = req.body;
  const stmt = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(updates)) {
    stmt.run(key, value);
  }
  res.json({ success: true });
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
