import mongoose from 'mongoose';

const SizodSchema = new mongoose.Schema(
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
  { versionKey: false, collection: 'DotEKO' }
);

export const DotEKO = mongoose.model('DotEKO', SizodSchema);
