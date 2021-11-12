import { Connection } from 'mongoose';
import {
  DATABASE_CONNECTION,
  IMAGE_MODEL,
  IMAGE_TAG_MODEL,
} from '@svv/api/core/constants';
import { ImageSchema, ImageTagSchema } from './schemas';

/**
 * This provider defines the `Image` Model for the current connection.
 */
export const imageModelProvider = {
  provide: IMAGE_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('Image', ImageSchema),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `Image Tag` Model for the current connection.
 */
export const imageTagModelProvider = {
  provide: IMAGE_TAG_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('ImageTag', ImageTagSchema),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Images` feature.
 */
export const imagesProviders = [imageModelProvider, imageTagModelProvider];
