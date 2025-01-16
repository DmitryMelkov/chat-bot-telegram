import mongoose from 'mongoose';

// Схема для данных котлов
const kotelSchema = new mongoose.Schema(
  {
    parameters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    info: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    alarms: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    im: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    others: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    lastUpdated: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Автоматически добавляет текущую дату и время
    },
  },
  { versionKey: false }
);

// Модели для каждого котла
export const Kotel1 = mongoose.model('Kotel1', kotelSchema);
export const Kotel2 = mongoose.model('Kotel2', kotelSchema);
export const Kotel3 = mongoose.model('Kotel3', kotelSchema);
