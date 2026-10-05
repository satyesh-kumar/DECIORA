import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  callsign: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['commander', 'instructor', 'admin'], 
    default: 'commander' 
  },
  rank: { type: String, default: 'Lieutenant' },
  readinessScore: { type: Number, default: 80 },
  decisionAccuracy: { type: Number, default: 80 },
  riskManagement: { type: Number, default: 80 },
  informationUsage: { type: Number, default: 80 },
  scenariosCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
