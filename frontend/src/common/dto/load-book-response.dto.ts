import type { LoadBooksResponseDto } from './load-books-response.dto';
import { LoadGenresResponseDto } from './load-genres-response.dto';

export type LoadBookResponseDto = LoadBooksResponseDto & {
  isPrivate: boolean;
  accessLink: string;
  size: number;
  uploadedBy: string;
  addedToFavorites: number;
  genres: LoadGenresResponseDto[];
};
