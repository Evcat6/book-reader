import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';

import { ConfigKey } from '@/common/config/config';
import { AppLogger } from '@/common/service';

import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get(ConfigKey.MINIO),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService, AppLogger],
  exports: [MinioClientService],
})
export class MinioClientModule {}
