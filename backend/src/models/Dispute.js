const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Dispute reason is required'],
      enum: [
        'Damaged Goods',
        'Incorrect Item',
        'Quality Issues',
        'Missing Items',
        'Late Delivery',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please explain the issue'],
      trim: true,
    },
    evidenceImages: [String],
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

disputeSchema.index({ order: 1 });
disputeSchema.index({ status: 1 });

module.exports = mongoose.model('Dispute', disputeSchema);

