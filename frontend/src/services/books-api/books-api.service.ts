import { HttpMethod } from '@/common/enums/http-method.enum';
import { HttpService } from '../http/http.service';
import { ContentType } from '@/common/enums/content-type.enum';
import { LoadBooksResponseDto } from '@/common/dto';
import { LoadPaginatedResponse } from '@/common/dto/load-paginated-response.dto';
import { LoadBookResponseDto } from '@/common/dto/load-book-response.dto';

class BooksApiService {
  constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async create(payload: FormData) {
    await this.httpService.load(`${this.baseEndpoint}`, {
      method: HttpMethod.POST,
      payload,
      contentType: ContentType.MULTIPART_FORM_DATA,
    });
  }

  public async loadMany(query: { userOwned: boolean; page: number; searchQuery: string; order: 'ASC' | 'DESC' }) {
    const response = await this.httpService.load(`${this.baseEndpoint}`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
      query,
    });
    return await response.json<LoadPaginatedResponse<LoadBooksResponseDto[]>>();
  }

  public async loadPopular() {
    const response = await this.httpService.load(`${this.baseEndpoint}/popular`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
    });
    return await response.json<LoadBooksResponseDto[]>();
  }

  public async loadById(id: string) {
    const response = await this.httpService.load(`${this.baseEndpoint}/${id}`, {
      method: HttpMethod.GET,
      contentType: ContentType.APPLICATION_JSON,
    });
    return await response.json<LoadBookResponseDto>();
  }

  public async sendView(id: string) {
    await this.httpService.load(`${this.baseEndpoint}/send-view/${id}`, {
      method: HttpMethod.POST,
      contentType: ContentType.APPLICATION_JSON,
    });
  }
}

export { BooksApiService };
