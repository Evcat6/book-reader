import type { LoadUserResponseDto } from '@/common/dto/load-user-response.dto';
import { HttpMethod } from '@/common/enums/http-method.enum';

import type { HttpService } from '../http/http.service';
import { ContentType } from '@/common/enums';

class UserService {
  public constructor(private httpService: HttpService, private baseEndpoint: string) { }

  public async loadMe(): Promise<LoadUserResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/me`, { method: HttpMethod.GET });
    return await response.json<LoadUserResponseDto>();
  }

  public async updateMe(): Promise<LoadUserResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/me`, { method: HttpMethod.PATCH });
    return await response.json<LoadUserResponseDto>();
  }

  public async updateAvatar(payload: FormData): Promise<LoadUserResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/me`, {
      method: HttpMethod.PATCH,
      contentType: ContentType.MULTIPART_FORM_DATA,
      payload
    })
    return await response.json<LoadUserResponseDto>();
  }

  public async deleteMe(): Promise<void> {
    await this.httpService.load(`${this.baseEndpoint}/me`, {
      method: HttpMethod.DELETE,
    })
  }
}

export { UserService };
