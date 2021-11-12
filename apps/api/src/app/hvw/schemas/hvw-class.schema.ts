import * as mongoose from 'mongoose';

export const HvwClassSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    shortName: { type: String, required: true },
    longName: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
