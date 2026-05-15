import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title.'],
  },
  status: {
    type: String,
    enum: ['incomplete', 'waiting', 'complete'],
    default: 'incomplete',
  },
  isDaily: {
    type: Boolean,
    required: true,
  },
  date: {
    type: String, // For daily quests, e.g., "2026-05-16"
  },
  dueDate: {
    type: String, // For weekly assignments
  },
}, {
  timestamps: true,
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
