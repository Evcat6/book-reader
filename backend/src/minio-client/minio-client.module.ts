import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKey } from '@/common/config/config';
import { AppLogger } from '@/common/service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get(ConfigKey.MINIO),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService, AppLogger],
  exports: [MinioClientService],
})
export class MinioClientModule {}
