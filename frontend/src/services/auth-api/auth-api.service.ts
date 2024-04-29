import { HttpService } from '../http/http.service';
import { RegisterUserReqDto, LoginUserReqDto, AuthUserResDto } from '@/common/dto';
import { HttpMethod } from '@/common/enums/http-method.enum';

class AuthApiService {
  constructor(private httpService: HttpService, private baseEndpoint: string) {}

  public async login(payload: LoginUserReqDto) {
    const response = await this.httpService.load(`${this.baseEndpoint}/login`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResDto>();
  }

  public async register(payload: RegisterUserReqDto) {
    const response = await this.httpService.load(`${this.baseEndpoint}/register`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      hasAuth: false,
    });
    return await response.json<AuthUserResDto>();
  }
}

export { AuthApiService };
