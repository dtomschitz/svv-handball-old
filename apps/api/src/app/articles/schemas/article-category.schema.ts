import * as mongoose from 'mongoose';

export const ArticleCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    link: String,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
