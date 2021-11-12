import { HvwCachingType } from '@svv/core/models';
import * as mongoose from 'mongoose';

export const HvwJobSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    type: { type: HvwCachingType, required: true },
    cronExpression: { type: String, required: true },
    lastExecution: String,
    disabled: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
