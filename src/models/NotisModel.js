// models/NotisModel.js
import mongoose from 'mongoose';

const notisSchema = new mongoose.Schema(
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

export const NotisVR1 = mongoose.model('NotisVR1', notisSchema);
export const NotisVR2 = mongoose.model('NotisVR2', notisSchema);
