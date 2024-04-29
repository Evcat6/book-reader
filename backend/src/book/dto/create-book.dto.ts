import { BufferedFile } from '@/minio-client/model';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  readonly file: BufferedFile;

  @ApiProperty()
  @IsBoolean()
  readonly isPrivate: boolean;
}
