import type { LoadUserResponse } from '@/common/dto/load-user-response.dto';
import { HttpMethod } from '@/common/enums/http-method.enum';

import type { HttpService } from '../http/http.service';

class UserService {
  public constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async load(): Promise<LoadUserResponse> {
    const response = await this.httpService.load(`${this.baseEndpoint}/me`, { method: HttpMethod.GET });
    return await response.json<LoadUserResponse>();
  }
}

export { UserService };
