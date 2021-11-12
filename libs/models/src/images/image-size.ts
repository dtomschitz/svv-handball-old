export interface ImageSize {
  path: string;
  width: number;
  height: number;
}

export enum ImageSizes {
  ORIGINAL = 'original',
  WEB = 'web',
  ICON = 'icon',
}

export const imageSizes = [
  {
    name: 'Orginal',
    value: ImageSizes.ORIGINAL,
  },
  {
    name: 'Web optimiert',
    value: ImageSizes.WEB,
  },
  {
    name: 'Icon (Mannschafts Icon)',
    value: ImageSizes.ICON,
  },
];
