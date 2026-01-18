import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'price' | 'percentage' | 'volume';
  condition: 'greater-than' | 'less-than' | 'equals';
  thresholdValue: number;
  frequency: 'once' | 'daily' | 'every-time';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    company: {
      type: String,
      required: true,
    },
    alertName: {
      type: String,
      required: true,
    },
    alertType: {
      type: String,
      enum: ['price', 'percentage', 'volume'],
      default: 'price',
    },
    condition: {
      type: String,
      enum: ['greater-than', 'less-than', 'equals'],
      required: true,
    },
    thresholdValue: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'every-time'],
      default: 'once',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation
export const Alert =
  mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
