import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreEntity } from './entity/genre.entity';
import type { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>
  ) {}

  public async getAll(): Promise<GenreEntity[]> {
    return await this.genreRepository.find();
  }

  public async getById(genreId): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOneBy({ id: genreId });
    if(!genre) {
      throw new NotFoundException();
    }
    return genre
  }
}
