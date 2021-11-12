export interface Download {
  _id: string;
  name: string;
  file: {
    path: string;
    size: number;
  };
  disabled?: boolean;
}
