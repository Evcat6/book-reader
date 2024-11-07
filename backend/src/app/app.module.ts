import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CloudinaryModule } from 'nestjs-cloudinary';

import { AuthModule } from '@/auth/auth.module';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { BookModule } from '@/book/book.module';
import { ConfigKey, configurations } from '@/common/config/config';
import { HttpExceptionFilter } from '@/common/filter/http-exception.filter';
import { HttpLoggerMiddleware } from '@/common/middleware';
import { AppLogger } from '@/common/service';
import { configModuleValidationSchema } from '@/common/validation-schema/config-module.validation';
import { UserModule } from '@/user/user.module';
import { GenreModule } from '@/genre/genre.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
      load: configurations,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get(ConfigKey.POSTGRES),
      inject: [ConfigService],
    }),
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get(ConfigKey.CLOUDINARY),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      isGlobal: true,
      useFactory: (configService: ConfigService) =>
        configService.get(ConfigKey.REDIS),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get(ConfigKey.MAILER),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    BookModule,
    GenreModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: (): ValidationPipe => new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AppLogger,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
