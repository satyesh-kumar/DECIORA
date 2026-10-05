import mongoose from 'mongoose';

const PerformanceMetricSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scenarioId: { type: String, required: true },
  communicationCondition: { 
    type: String, 
    enum: ['normal', 'delayed', 'conflicting', 'blackout'],
    required: true
  },
  decisionLatencySeconds: { type: Number, required: true },
  accuracyScore: { type: Number, required: true },
  riskScore: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

export default mongoose.models.PerformanceMetric || mongoose.model('PerformanceMetric', PerformanceMetricSchema);
