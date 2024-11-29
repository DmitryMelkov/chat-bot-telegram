import mongoose from 'mongoose';


const furnaceMPASchema = new mongoose.Schema(
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

export const FurnaceMPA2 = mongoose.model('FurnaceMPA2', furnaceMPASchema);
export const FurnaceMPA3 = mongoose.model('FurnaceMPA3', furnaceMPASchema);
