import mongoose, { Schema, Document } from 'mongoose';

export interface IAddon extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  icon?: string;
  image?: string;
  maxQuantity?: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddonSchema = new Schema<IAddon>(
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

export default mongoose.model<IAddon>('Addon', AddonSchema);
