import mongoose from 'mongoose';

const remainingCashSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  amountHave: {
    type: Number,
    required: true
  },
  stockEntry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  remainingAmount: {
    type: Number,
    required: true
  },

}, {
  timestamps: true
});

export default mongoose.model('RemAmount', remainingCashSchema);
