import { UserRole } from '@svv/core/models';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: { type: String, select: false },
    role: { type: UserRole, required: true },
    firstName: String,
    lastName: String,
    lastLogin: String,
    refreshToken: { type: String, select: false },
    canLogin: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
