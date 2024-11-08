import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

import { AppLogger } from '@/common/service';
import { KafkaModule } from '@/kafka/kafka.module';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    KafkaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AppLogger],
})
export class AuthModule {}
