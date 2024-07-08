import type { AuthUserResDto, LoginUserReqDto, RegisterUserReqDto } from '@/common/dto';
import { HttpMethod } from '@/common/enums/http-method.enum';

import type { HttpService } from '../http/http.service';

class AuthApiService {
  public constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async login(payload: LoginUserReqDto): Promise<AuthUserResDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/login`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResDto>();
  }

  public async register(payload: RegisterUserReqDto): Promise<AuthUserResDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/register`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResDto>();
  }
}

export { AuthApiService };
