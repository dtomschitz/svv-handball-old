import * as mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    abbreviation: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    type: { type: String, required: true },
    position: { type: Number, required: true },
    contact: String,
    images: {
      type: {
        icon: {
          path: String,
          width: Number,
          height: Number,
        },
        big: {
          path: String,
          width: Number,
          height: Number,
        },
        small: {
          path: String,
          width: Number,
          height: Number,
        },
        updatedAt: String,
        disabled: Boolean,
      },
      default: undefined,
    },
    coachIds: [mongoose.Schema.Types.ObjectId],
    classId: String,
    trainingTimes: [],
    articleCategoryId: String,
    settings: {
      cacheTable: { type: Boolean, default: true },
      cacheGames: { type: Boolean, default: true },
    },
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

teamSchema.virtual('class', {
  ref: 'HvwClass',
  localField: 'classId',
  foreignField: '_id',
  justOne: true,
});

teamSchema.virtual('coaches', {
  ref: 'User',
  localField: 'coachIds',
  foreignField: '_id',
});

export const TeamSchema = teamSchema;
