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

export const ReactorK296 = mongoose.model('ReactorK296', millSchema, 'ReactorK296');
