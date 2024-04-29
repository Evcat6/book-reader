import { PageOptionsDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BooksOptionsDto extends PageOptionsDto {
  @ApiProperty({ name: 'searchQuery' })
  readonly searchQuery: string;

  @ApiProperty({ name: 'userOwned' })
  @Type(() => Boolean)
  readonly userOwned: boolean;
}
