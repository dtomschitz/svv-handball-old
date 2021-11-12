export interface ResizeTask {
  suffix?: string;
  format: 'png' | 'jpeg' | 'jpg' | 'gif';
  width?: number;
  height?: number;
}
