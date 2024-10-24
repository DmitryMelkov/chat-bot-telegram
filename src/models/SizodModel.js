import mongoose from 'mongoose';

const SizodSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed }, // Mixed type for various data types
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, collection: 'DotEKO' } // Явно указываем коллекцию
);

export const DotEKO = mongoose.model('DotEKO', SizodSchema);
// export const DotPRO = mongoose.model('DotPRO', SizodSchema);
