import mongoose, { Schema } from 'mongoose';

const PlanSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
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
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 1,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      trim: true,
    },
    maxGuests: {
      type: Number,
      min: 1,
    },
    includes: [
      {
        type: String,
        trim: true,
      },
    ],
    excludes: [
      {
        type: String,
        trim: true,
      },
    ],
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
PlanSchema.index({ name: 1 });
PlanSchema.index({ isActive: 1 });
PlanSchema.index({ displayOrder: 1 });

export default mongoose.model('Plan', PlanSchema);
