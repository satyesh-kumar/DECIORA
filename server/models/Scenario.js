import mongoose from 'mongoose';

const ScenarioSchema = new mongoose.Schema({
  scenarioId: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  sector: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  durationSeconds: { type: Number, default: 120 },
  decisionWindowSeconds: { type: Number, default: 30 },
  objective: { type: String, required: true },
  context: { type: String, required: true },
  communicationProfile: {
    initialLevel: { type: Number, default: 1 },
    degradedLevel: { type: Number, default: 2 },
    summary: { type: String }
  },
  events: [mongoose.Schema.Types.Mixed],
  decisions: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);
