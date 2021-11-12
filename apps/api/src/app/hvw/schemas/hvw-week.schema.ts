import * as mongoose from 'mongoose';

export const HvwWeekSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    current: Boolean,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
