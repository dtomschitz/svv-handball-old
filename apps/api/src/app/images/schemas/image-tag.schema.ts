import * as mongoose from 'mongoose';

export const ImageTagSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    isSeasonTag: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
