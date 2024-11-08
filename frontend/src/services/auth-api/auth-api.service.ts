import type { AuthUserResponseDto, LoginUserRequestDto, RegisterUserRequestDto } from '@/common/dto';
import { HttpMethod } from '@/common/enums/http-method.enum';

import type { HttpService } from '../http/http.service';

class AuthApiService {
  public constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async login(payload: LoginUserRequestDto): Promise<AuthUserResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/login`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResponseDto>();
  }

  public async register(payload: RegisterUserRequestDto): Promise<AuthUserResponseDto> {
    const response = await this.httpService.load(`${this.baseEndpoint}/register`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResponseDto>();
  }
}

export { AuthApiService };
