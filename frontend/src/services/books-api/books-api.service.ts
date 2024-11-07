import type { LoadBooksResponseDto } from '@/common/dto';
import type { LoadBookResponseDto } from '@/common/dto/load-book-response.dto';
import type { LoadPaginatedResponse } from '@/common/dto/load-paginated-response.dto';
import { ContentType } from '@/common/enums/content-type.enum';
import { HttpMethod } from '@/common/enums/http-method.enum';

import type { HttpService } from '../http/http.service';

class BooksApiService {
  public constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async create(payload: FormData): Promise<void> {
    await this.httpService.load(`${this.baseEndpoint}`, {
      method: HttpMethod.POST,
      payload,
      contentType: ContentType.MULTIPART_FORM_DATA,
    });
  }

  public async loadMany(query: {
    userOwned?: boolean;
    page: number;
    searchQuery: string;
    order: 'ASC' | 'DESC';
  }): Promise<LoadPaginatedResponse<LoadBooksResponseDto[]>> {
    const response = await this.httpService.load(`${this.baseEndpoint}`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
      query,
    });
    return await response.json<LoadPaginatedResponse<LoadBooksResponseDto[]>>();
  }

  public async loadPopular(): Promise<LoadBooksResponseDto[]> {
    const response = await this.httpService.load(`${this.baseEndpoint}/popular`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
    });
    return await response.json<LoadBooksResponseDto[]>();
  }

  public async loadById(id: string): Promise<LoadBookResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/${id}`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
    });
    return await response.json<LoadBookResponseDto>();
  }
}

export { BooksApiService };
