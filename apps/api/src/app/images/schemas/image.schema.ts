import * as mongoose from 'mongoose';

export const imageSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    type: { type: String, require: true },
    tagIds: [mongoose.Schema.Types.ObjectId],
    sizes: Object,
    disabled: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

imageSchema.virtual('tags', {
  ref: 'ImageTag',
  localField: 'tagIds',
  foreignField: '_id',
});

export const ImageSchema = imageSchema;
