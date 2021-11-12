import { ImageSize } from './image-size';
import { ImageTag } from './image-tag';
import { ImageType } from './image-type';

export interface Image {
  _id: string;
  name: string;
  type: ImageType;
  tagIds?: string[];
  tags?: ImageTag[];
  sizes: ImageSize[];
  disabled: boolean;
  archived: boolean;
}
