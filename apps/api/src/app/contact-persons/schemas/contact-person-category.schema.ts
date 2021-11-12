import * as mongoose from 'mongoose';

export const ContactPersonCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    position: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
