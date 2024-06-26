import { registerAs } from '@nestjs/config';
import { join } from 'path';

export enum ConfigKey {
  POSTGRES = 'POSTGRES',
  MINIO = 'MINIO',
  APP = 'APP',
  CLOUDINARY = 'CLOUDINARY',
}

export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

const PostgresConfig = registerAs(ConfigKey.POSTGRES, () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../..', '**', '*.entity.{ts,js}')],
  synchronize: true,
  // logging: true,
}));

const MinioConfig = registerAs(ConfigKey.MINIO, () => {
  const environment = process.env.NODE_ENV;

  return {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
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

export const configurations = [PostgresConfig, MinioConfig, CloudinaryConfig];
