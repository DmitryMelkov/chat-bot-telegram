import mongoose from 'mongoose';


const sushilkaSchema = new mongoose.Schema(
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

export const Sushilka1 = mongoose.model('Sushilka1', sushilkaSchema);
export const Sushilka2 = mongoose.model('Sushilka2', sushilkaSchema);
