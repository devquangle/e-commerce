export interface GoogleBookResponse {
  volumeId: string;
  name: string;
  authors: string[];
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  isbn: string | null;
  thumbnail: string | null;
  listPrice: number | null;
  retailPrice: number | null;
}
