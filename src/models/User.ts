import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: [true, 'Please specify a role.'],
  },
  coins: {
    type: Number,
    default: 0,
  },
  coupons: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
