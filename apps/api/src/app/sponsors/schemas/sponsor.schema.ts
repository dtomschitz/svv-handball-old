import * as mongoose from 'mongoose';

export const SponsorSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    link: String,
    img: {
      type: {
        path: String,
        updatedAt: String,
        disabled: Boolean,
      },
      default: undefined,
    },
    position: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
