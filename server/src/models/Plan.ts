import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  duration: number; // in hours
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  category?: string;
  maxGuests?: number;
  includes: string[];
  excludes?: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
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

export default mongoose.model<IPlan>('Plan', PlanSchema);
