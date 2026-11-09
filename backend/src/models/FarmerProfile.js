const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide the farm or business name'],
      trim: true,
      maxlength: [120, 'Farm name cannot exceed 120 characters'],
    },
    farmLocation: {
      type: String,
      required: [true, 'Please provide farm village/town location'],
      trim: true,
    },
    village: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    farmDescription: {
      type: String,
      trim: true,
      default: 'Dedicated to growing pure, wholesome produce directly for our consumers.',
    },
    farmingMethod: {
      type: String,
      enum: ['Organic Certified', 'Natural / Permaculture', 'Hydroponic', 'Conventional / Integrated'],
      default: 'Organic Certified',
    },
    cropTypes: {
      type: [String],
      default: ['Vegetables', 'Fruits'],
    },
    experienceYears: {
      type: Number,
      default: 5,
      min: 0,
    },
    totalAreaAcres: {
      type: Number,
      default: 4,
      min: 0.1,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    documents: [
      {
        docType: { type: String, default: 'Land Record / Farmer ID' },
        docUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
farmerProfileSchema.index({ verificationStatus: 1 });
farmerProfileSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);

