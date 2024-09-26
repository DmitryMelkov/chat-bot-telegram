import mongoose from 'mongoose';


const furnaceSchema = new mongoose.Schema(
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



export const FurnaceVR1 = mongoose.model('FurnaceVR1', furnaceSchema);
export const FurnaceVR2 = mongoose.model('FurnaceVR2', furnaceSchema);
