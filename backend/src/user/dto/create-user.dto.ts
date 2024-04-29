import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @MinLength(6)
  @MaxLength(320)
  readonly email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  readonly password: string;

  @ApiProperty({ example: 'John_123' })
  @IsString()
  @MinLength(5)
  readonly username: string;
}
