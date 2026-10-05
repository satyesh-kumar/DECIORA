import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'deciora_ps26048_classified_jwt_secret_key';

app.use(cors());
app.use(express.json());

// In-Memory Fallback Store if MongoDB is offline
const inMemoryDB = {
  users: [
    { id: 'usr_cmd_01', name: 'Commander Alpha', role: 'commander', email: 'commander@deciora.sim' },
    { id: 'usr_inst_01', name: 'Instructor Vance', role: 'instructor', email: 'instructor@deciora.sim' },
    { id: 'usr_adm_01', name: 'System Admin Cole', role: 'admin', email: 'admin@deciora.sim' }
  ],
  sessions: [],
  aarReports: {}
};

// Connect to MongoDB if available
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deciora';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('✓ DECIORA MongoDB Connected successfully.'))
  .catch((err) => console.log('ℹ DECIORA Running in Autonomous In-Memory Mode (MongoDB offline).'));

// --- ROUTES ---

// 1. Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, role = 'commander' } = req.body;
  const user = inMemoryDB.users.find(u => u.email === email) || {
    id: `usr_${Date.now()}`,
    name: email.split('@')[0],
    role,
    email
  };
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role = 'commander' } = req.body;
  const newUser = { id: `usr_${Date.now()}`, name, email, role };
  inMemoryDB.users.push(newUser);
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: newUser });
});

// 2. Training & Decisions
app.post('/api/training/decision', (req, res) => {
  const sessionRecord = req.body;
  inMemoryDB.sessions.unshift(sessionRecord);
  res.status(201).json({ success: true, session: sessionRecord });
});

app.get('/api/training/history', (req, res) => {
  res.json(inMemoryDB.sessions);
});

// 3. AAR Reports
app.post('/api/aar/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  inMemoryDB.aarReports[sessionId] = { ...req.body, submittedAt: new Date().toISOString() };
  res.json({ success: true, aar: inMemoryDB.aarReports[sessionId] });
});

app.get('/api/aar/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  res.json(inMemoryDB.aarReports[sessionId] || null);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', system: 'DECIORA-PS26048', mode: mongoose.connection.readyState === 1 ? 'MONGODB' : 'IN_MEMORY' });
});

app.listen(PORT, () => {
  console.log(`[DECIORA-SERVER] Operational on http://localhost:${PORT}`);
});
