import * as mongoose from 'mongoose';

const contactPersonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    categoryId: { type: String, required: true },
    people: { type: [String], required: true },
    position: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

contactPersonSchema.virtual('category', {
  ref: 'ContactPersonCategory',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

export const ContactPersonSchema = contactPersonSchema;
