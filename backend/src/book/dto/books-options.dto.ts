import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PageOptionsDto } from '@/common/dto';

export class BooksOptionsDto extends PageOptionsDto {
  @ApiProperty({ name: 'searchQuery' })
  public readonly searchQuery: string;

  @ApiProperty({ name: 'userOwned' })
  @Type(() => Boolean)
  public readonly userOwned: boolean;
}
