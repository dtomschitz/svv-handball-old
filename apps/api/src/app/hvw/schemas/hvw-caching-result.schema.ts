import { HvwCachingType } from '@svv/core/models';
import * as mongoose from 'mongoose';

const cachingResultSchema = new mongoose.Schema(
  {
    type: { type: HvwCachingType, required: true },
    neededTime: { type: String, required: true },
    status: { type: String, required: true },
    inserted: { type: Number, required: true },
    upserted: { type: Number, required: true },
    matched: { type: Number, required: true },
    modified: { type: Number, required: true },
    removed: { type: Number, required: true },
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, expires: '2m', default: Date.now },
  },
  {
    timestamps: {
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

cachingResultSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

cachingResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

export const HvwCachingResultSchema = cachingResultSchema;
