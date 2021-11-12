import * as mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    content: { type: String, required: true },
    categoryIds: [mongoose.Schema.Types.ObjectId],
    authorIds: [mongoose.Schema.Types.ObjectId],
    pinned: { type: Boolean, default: false },
    readMore: { type: Boolean, default: true },
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

articleSchema.virtual('categories', {
  ref: 'ArticleCategory',
  localField: 'categoryIds',
  foreignField: '_id',
});

articleSchema.virtual('authors', {
  ref: 'User',
  localField: 'authorIds',
  foreignField: '_id',
});

export const ArticleSchema = articleSchema;
