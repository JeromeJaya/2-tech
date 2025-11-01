import mongoose, { Schema } from 'mongoose';

const AddonSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Addon name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    maxQuantity: {
      type: Number,
      min: 1,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AddonSchema.index({ name: 1 });
AddonSchema.index({ category: 1 });
AddonSchema.index({ isAvailable: 1 });
AddonSchema.index({ displayOrder: 1 });

export default mongoose.model('Addon', AddonSchema);
