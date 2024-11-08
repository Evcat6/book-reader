import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsString, IsBooleanString, IsArray } from 'class-validator';

import { BufferedFile } from '@/minio-client/model';
import { Transform } from 'class-transformer';
import { IsArrayUnique } from '@/common/decorator/is-unique-array.decorator';

export class CreateBookRequestDto {
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  public readonly file: BufferedFile;

  @ApiProperty()
  @IsBooleanString({ message: "Is Boolean String" })
  public readonly isPrivate: boolean;

  @ApiProperty()
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @ArrayMinSize(1)
  @IsArrayUnique()
  public readonly genresIds: string[];
}
