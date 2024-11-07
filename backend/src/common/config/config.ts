import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import type { RedisStore } from 'cache-manager-redis-store';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension';

export enum ConfigKey {
  POSTGRES = 'POSTGRES',
  MINIO = 'MINIO',
  APP = 'APP',
  CLOUDINARY = 'CLOUDINARY',
  REDIS = 'REDIS',
  MAILER = 'MAILER',
  KAFKA = 'KAFKA',
}
export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test'
}

const PostgresConfig = registerAs(ConfigKey.POSTGRES, (): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../..', '**', '*.entity.{ts,js}')],
  seeds: [join(__dirname, '../../seeds',)],
  synchronize: true,
}));

const MinioConfig = registerAs(ConfigKey.MINIO, () => {
  const environment = process.env.NODE_ENV as Environment;

  return {
    endPoint: process.env.MINIO_ENDPOINT,
    port: Number.parseInt(process.env.MINIO_PORT),
    useSSL: environment === Environment.PRODUCTION,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
  };
});

const CloudinaryConfig = registerAs(ConfigKey.CLOUDINARY, () => ({
  isGlobal: true,
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}));

const RedisConfig = registerAs(ConfigKey.REDIS, () => {
  const store = redisStore({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT),
    },
    password: process.env.REDIS_PASSWORD,
  });
  return {
    store: (): Promise<RedisStore> => store,
  };
});

const MailerConfig = registerAs(ConfigKey.MAILER, () => ({
  transport: {
    host: process.env.GMAIL_HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  },
  template: {
    dir: process.cwd() + '/dist/templates/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}));

const KafkaConfig = registerAs(ConfigKey.KAFKA, () => ({}));

const KafkaClientConfig = registerAs(ConfigKey.KAFKA, () => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs',
      brokers: [process.env.KAFKA_HOST],
    },
    consumer: {
      groupId: 'nestjs-consumer',
    },
  },
}));

export const configurations = [
  PostgresConfig,
  MinioConfig,
  CloudinaryConfig,
  RedisConfig,
  MailerConfig,
  KafkaConfig,
  KafkaClientConfig,
];
