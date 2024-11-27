import mongoose from 'mongoose';


const millSchema = new mongoose.Schema(
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

export const Mill1 = mongoose.model('Mill1', millSchema, 'Mill1');
export const Mill2 = mongoose.model('Mill2', millSchema, 'Mill2');
export const Mill10b = mongoose.model('Mill10b', millSchema, 'Mill10b');