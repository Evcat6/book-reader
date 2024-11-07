import { AuthGuard } from '@/auth/guard/auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { GenreService } from './genre.service';
import { RedisExpirationTime } from '@/common/enum';

@Controller('genres')
@ApiTags('Genres')
@UseGuards(AuthGuard)
export class GenreController {
    public constructor(private readonly genreService: GenreService) {}

    @Get()
    @CacheKey('book-genres')
    @CacheTTL(RedisExpirationTime.ONE_WEEK)
    public async getAll() {
        this.genreService.getAll().then(console.log);
        return await this.genreService.getAll();
    }
}
