import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { AppLogger } from '@/common/service';

import {
  EMAIL_VERIFICATION_TOPIC,
  KAFKA_CLIENT,
} from './constant/kafka.constant';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  public constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly logger: AppLogger
  ) {}

  public async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf(EMAIL_VERIFICATION_TOPIC);
    await this.kafkaClient.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  public sendMessage<T>(topic: string, message: T): void {
    this.kafkaClient.send(topic, message).subscribe({
      next: (result) =>
        this.logger.log(`Message sent to ${topic} topic`, result),
      error: (error) =>
        this.logger.error(`Failed to send message to ${topic} topic`, error),
    });
  }
}
