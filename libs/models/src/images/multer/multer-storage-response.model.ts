import { ResizeResult } from './resize-result.model';

export interface MulterStorageResponse {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  results: ResizeResult[];
}
