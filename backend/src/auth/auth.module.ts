import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
import { AppLogger } from '@/common/service';
import { BullModule } from '@nestjs/bull';
import { AuthProcessor } from './auth.processor';

config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    BullModule.registerQueue({
      name: 'auth'
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AppLogger, AuthProcessor],
})
export class AuthModule {}
