import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { BufferedFile } from '@/minio-client/model';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  public readonly file: BufferedFile;

  @ApiProperty()
  @IsBoolean()
  public readonly isPrivate: boolean;
}
