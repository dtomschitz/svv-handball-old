import * as mongoose from 'mongoose';

export const gameSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    appId: { type: Number, required: true },
    classId: { type: String, required: true },
    no: { type: Number, required: true, unique: true },
    sGId: Number,
    referee: String,
    weekDay: { type: String, required: true },
    week: { type: String, required: true },
    date: { type: String, required: true },
    time: String,
    comment: String,
    groupsortTxt: String,
    live: Boolean,
    teams: {
      home: {
        name: String,
        points: Number,
        goals: String,
        goals_1: String,
      },
      guest: {
        name: String,
        points: Number,
        goals: String,
        goals_1: String,
      },
    },
    gymnasium: {
      id: Number,
      name: String,
      no: Number,
      postal: Number,
      street: String,
      town: String,
    },
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

gameSchema.virtual('class', {
  ref: 'HvwClass',
  localField: 'classId',
  foreignField: '_id',
  justOne: true,
});

gameSchema.virtual('team', {
  ref: 'Team',
  localField: 'classId',
  foreignField: 'classId',
  justOne: true,
});

export const HvwGameSchema = gameSchema;
