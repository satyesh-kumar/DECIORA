import mongoose from 'mongoose';

const AARReportSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  scenarioId: { type: String, required: true },
  whyDecision: { type: String },
  mostInfluentialInfo: { type: String },
  unreliableInfo: { type: String },
  repeatDecision: { type: String },
  instructorNotes: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.AARReport || mongoose.model('AARReport', AARReportSchema);
