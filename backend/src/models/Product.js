const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide unit price in ₹'],
      min: [1, 'Price must be greater than zero'],
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'bunch', 'dozen', 'litre', 'box', 'piece'],
      default: 'kg',
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 10,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      ],
    },
    isOrganic: {
      type: Boolean,
      default: true,
    },
    harvestDate: {
      type: Date,
      default: Date.now,
    },
    farmLocation: {
      type: String,
      default: '',
    },
    village: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
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

// Indexes for fast searching, filtering, and sorting
productSchema.index({ name: 'text', description: 'text', farmLocation: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ farmer: 1 });
productSchema.index({ isOrganic: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });

module.exports = mongoose.model('Product', productSchema);

