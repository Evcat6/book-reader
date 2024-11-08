import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClientProvider } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';

import { ConfigKey } from '@/common/config/config';
import { AppLogger } from '@/common/service';

import { KAFKA_CLIENT } from './constant/kafka.constant';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (
            configService: ConfigService
          ): ClientProvider | Promise<ClientProvider> =>
            configService.get(ConfigKey.KAFKA),
          inject: [ConfigService],
          name: KAFKA_CLIENT,
        },
      ],
    }),
  ],
  providers: [KafkaService, AppLogger],
  exports: [KafkaService],
})
export class KafkaModule {}
