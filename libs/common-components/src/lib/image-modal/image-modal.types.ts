export interface ImageModalData {
  title: string;
  subtitle?: string;
  url: string;
}

export interface ImageModalConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: ImageModalData;
}
