// models/NotisModel.js
import mongoose from 'mongoose';

const notisSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }, // Mixed type for various data types
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // Отключаем поле __v
);

export const NotisVR1 = mongoose.model('NotisVR1', notisSchema);
export const NotisVR2 = mongoose.model('NotisVR2', notisSchema);
