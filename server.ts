import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./src/db.js";
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Initialize payment gateways (use dummy keys if env vars are missing)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', { apiVersion: '2026-02-25.clover' });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Notification Routes ---

app.post("/api/notifications/email", (req, res) => {
  const { to, subject, type, data } = req.body;
  
  // In a real application, you would integrate with SendGrid, Mailgun, AWS SES, etc.
  console.log(`\n[EMAIL NOTIFICATION SIMULATION]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Type: ${type}`);
  console.log(`Data:`, data);
  console.log(`-----------------------------------\n`);

  res.json({ success: true, message: "Email notification queued successfully" });
});

// --- Payment Routes ---

const PLANS = {
  pro_monthly: { price: 900, currency: 'usd', credits: 500, name: 'Pro Plan (Monthly)' },
  pro_yearly: { price: 9000, currency: 'usd', credits: 500, name: 'Pro Plan (Yearly)' },
  premium_monthly: { price: 1900, currency: 'usd', credits: 999999, name: 'Premium Plan (Monthly)' },
  premium_yearly: { price: 19000, currency: 'usd', credits: 999999, name: 'Premium Plan (Yearly)' }
};

app.post("/api/payments/stripe/create-checkout-session", authenticateToken, async (req: any, res) => {
  const { planId, isYearly } = req.body;
  const planKey = `${planId}_${isYearly ? 'yearly' : 'monthly'}` as keyof typeof PLANS;
  const plan = PLANS[planKey];

  if (!plan) return res.status(400).json({ error: "Invalid plan" });

  try {
    // In a real app, you'd use actual Stripe Price IDs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: { name: plan.name },
            unit_amount: plan.price,
            recurring: { interval: isYearly ? 'year' : 'month' }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/?payment=success&plan=${planId}`,
      cancel_url: `${req.headers.origin}/?payment=cancelled`,
      client_reference_id: req.user.id.toString(),
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/razorpay/create-order", authenticateToken, async (req: any, res) => {
  const { planId, isYearly } = req.body;
  const planKey = `${planId}_${isYearly ? 'yearly' : 'monthly'}` as keyof typeof PLANS;
  const plan = PLANS[planKey];

  if (!plan) return res.status(400).json({ error: "Invalid plan" });

  try {
    // Convert USD to INR roughly for Razorpay demo
    const amountInr = plan.price * 80; 
    
    const order = await razorpay.orders.create({
      amount: amountInr,
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: { planId, userId: req.user.id }
    });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/verify", authenticateToken, async (req: any, res) => {
  const { planId, paymentId, provider } = req.body;
  
  // In a real app, verify the payment signature/status with Stripe/Razorpay
  // For this demo, we assume success if they hit this endpoint
  
  const credits = planId === 'premium' ? 999999 : 500;
  
  try {
    db.prepare("UPDATE users SET subscription_tier = ?, credits = ? WHERE id = ?").run(planId, credits, req.user.id);
    const user: any = db.prepare("SELECT id, email, credits, is_admin, subscription_tier FROM users WHERE id = ?").get(req.user.id);
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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

app.get("/api/auth/google/url", (req, res) => {
  const redirectUri = `${req.headers.origin || process.env.APP_URL}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});

app.get(["/api/auth/google/callback", "/api/auth/google/callback/"], async (req, res) => {
  const { code } = req.query;
  try {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error('Failed to get access token');

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    const email = userData.email;

    let user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
      const result = stmt.run(email, dummyPassword);
      user = { id: result.lastInsertRowid, email, credits: 30, subscription_tier: 'free', is_admin: 0 };
    }
    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET);
    const userObj = { id: user.id, email: user.email, credits: user.credits, is_admin: user.is_admin, subscription_tier: user.subscription_tier };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: '${token}', user: ${JSON.stringify(userObj)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    res.status(400).send(`Authentication failed: ${error.message}`);
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
    app.get('*', (req, res) => {
      const indexHtml = path.resolve('dist/index.html');
      fs.readFile(indexHtml, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading index.html:', err);
          return res.status(500).send('Error loading page');
        }
        const title = 'Studio Pro - AI-Powered Content Creation';
        const description = 'Create stunning videos, images, and voiceovers with the power of AI. Your all-in-one content creation suite.';
        const html = data
          .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
          .replace(/<meta name="description" content=".*"\/>/, `<meta name="description" content="${description}"/>`);
        res.send(html);
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
