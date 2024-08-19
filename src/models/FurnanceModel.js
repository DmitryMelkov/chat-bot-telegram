import mongoose from 'mongoose';

const furnaceSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed },  // Mixed type for various data types
  timestamp: {
    type: String,
    default: () => new Date().toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
}, { versionKey: false }); // Отключаем поле __v

export const FurnaceVR1 = mongoose.model('FurnaceVR1', furnaceSchema);
export const FurnaceVR2 = mongoose.model('FurnaceVR2', furnaceSchema);
