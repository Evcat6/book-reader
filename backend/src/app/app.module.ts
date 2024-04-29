import { AuthModule } from '@/auth/auth.module';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { BookModule } from '@/book/book.module';
import { ConfigKey, configurations } from '@/common/config/config';
import { HttpExceptionFilter } from '@/common/filter/http-exception.filter';
import { HttpLoggerMiddleware } from '@/common/middleware';
import { AppLogger } from '@/common/service';
import { configModuleValidationSchema } from '@/common/validation-schema/config-module.validation';
import { UserModule } from '@/user/user.module';
import { ClassSerializerInterceptor, MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
      load: configurations,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get(ConfigKey.POSTGRES),
      inject: [ConfigService],
    }),
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get(ConfigKey.CLOUDINARY),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BookModule,
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
      useFactory: () => new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AppLogger,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
