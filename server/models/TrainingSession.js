import mongoose from 'mongoose';

const TrainingSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scenarioId: { type: String, required: true },
  scenarioTitle: { type: String, required: true },
  score: { type: Number, required: true },
  decisionTimeSec: { type: Number, required: true },
  commLevelMax: { type: String },
  decisionChosen: { type: String, required: true },
  outcome: { type: String },
  outcomeQuality: { type: String },
  scoreBreakdown: {
    decisionQuality: Number,
    informationUsage: Number,
    riskManagement: Number,
    decisionTime: Number,
    communication: Number
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.models.TrainingSession || mongoose.model('TrainingSession', TrainingSessionSchema);
