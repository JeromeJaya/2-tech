import mongoose, { Schema } from 'mongoose';

const PhotoSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PhotoSchema.index({ bookingId: 1 });
PhotoSchema.index({ createdAt: -1 });

export default mongoose.model('Photo', PhotoSchema);
