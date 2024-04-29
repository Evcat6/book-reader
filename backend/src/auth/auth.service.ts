import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) { }

  private async validate(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  public async login(user: LoginUserDto) {
    const { email, id } = await this.validate(user.email, user.password);
    const payload = { email, sub: id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async register(user: CreateUserDto) {
    const { email } = await this.usersService.create(user);
    return await this.login({ password: user.password, email: email });
  }
}
