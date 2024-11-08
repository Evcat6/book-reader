import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserRequestDto {
  @IsEmail()
  @ApiProperty()
  public readonly email: string;

  @IsString()
  @ApiProperty()
  public readonly password: string;
}
