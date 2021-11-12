import { SponsorImage } from './sponsor-image.model';

export interface Sponsor {
  _id: string;
  name: string;
  img?: SponsorImage;
  link?: string;
  position: number;
  disabled?: boolean;
}
