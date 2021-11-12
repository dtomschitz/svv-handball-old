import * as mongoose from 'mongoose';

const hvwSchema = new mongoose.Schema(
  {
    classId: { type: String, required: true },
    scores: { type: Object, required: true },
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

hvwSchema.virtual('class', {
  ref: 'HvwClass',
  localField: 'classId',
  foreignField: '_id',
  justOne: true,
});

export const HvwTableSchema = hvwSchema;
