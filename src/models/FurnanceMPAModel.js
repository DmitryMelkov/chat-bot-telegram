import mongoose from 'mongoose';


const furnaceMPASchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }, // Mixed type for various data types
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
); // Отключаем поле __v



export const FurnaceMPA2 = mongoose.model('FurnaceMPA2', furnaceMPASchema);
export const FurnaceMPA3 = mongoose.model('FurnaceMPA3', furnaceMPASchema);
