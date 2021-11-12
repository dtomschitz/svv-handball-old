export interface TeamImages {
  icon: TeamImage;
  small: TeamImage;
  big: TeamImage;
  updatedAt: string;
  disabled: boolean;
}

export interface TeamImage {
  path: string;
  width: number;
  height: number;
}
