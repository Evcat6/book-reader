import { HttpMethod } from '@/common/enums/http-method.enum';
import { HttpService } from '../http/http.service';
import { LoadUserResponse } from '@/common/dto/load-user-response.dto';

class UserService {
  constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async load() {
    const response = await this.httpService.load(`${this.baseEndpoint}/me`, { method: HttpMethod.GET });
    return await response.json<LoadUserResponse>();
  }
}

export { UserService };
