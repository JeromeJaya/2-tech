import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  date: Date;
  slotId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  addons: Array<{
    addonId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }>;
  balloonColors?: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
  notes?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Slot is required'],
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan is required'],
    },
    addons: [
      {
        addonId: {
          type: Schema.Types.ObjectId,
          ref: 'Addon',
        },
        name: String,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: Number,
      },
    ],
    balloonColors: [
      {
        type: String,
        trim: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

// Generate booking ID before saving
BookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BK${Date.now()}${count + 1}`;
  }
  next();
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
