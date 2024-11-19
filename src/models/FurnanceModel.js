import mongoose from 'mongoose';


const furnaceSchema = new mongoose.Schema(
  {
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Позволяет хранить произвольные пары "ключ-значение"
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
); // Отключаем поле __v

export const FurnaceVR1 = mongoose.model('FurnaceVR1', furnaceSchema);
export const FurnaceVR2 = mongoose.model('FurnaceVR2', furnaceSchema);
