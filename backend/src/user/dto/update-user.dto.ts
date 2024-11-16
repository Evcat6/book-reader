import { BufferedFile } from '@/minio-client/model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Nick' })
  public readonly username?: string;

  @ApiProperty()
  public readonly file: BufferedFile;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsStrongPassword()
  @IsOptional()
  @MinLength(8)
  public readonly oldPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsStrongPassword()
  @IsOptional()
  @MinLength(8)
  public readonly newPassword: string;
}
