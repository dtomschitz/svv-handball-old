export interface ListAllArticles {
  skip?: number;
  limit?: number;
  pinned?: boolean;
  category?: string;
  checkNext?: boolean;
}
