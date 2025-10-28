import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot extends Document {
  name: string;
  startTime: string;
  endTime: string;
  date: Date;
  isAvailable: boolean;
  bookingId?: mongoose.Types.ObjectId;
  maxCapacity: number;
  currentBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    name: {
      type: String,
      required: [true, 'Slot name is required'],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    maxCapacity: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SlotSchema.index({ date: 1, startTime: 1 });
SlotSchema.index({ isAvailable: 1 });

// Check availability before booking
SlotSchema.methods.checkAvailability = function (): boolean {
  return this.isAvailable && this.currentBookings < this.maxCapacity;
};

export default mongoose.model<ISlot>('Slot', SlotSchema);
