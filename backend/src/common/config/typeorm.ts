import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { join } from 'path';
import { config } from 'dotenv';

config();

export const getTypeORMConfig = (): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../..', '**', '*.entity.{ts,js}')],
  seeds: [join(__dirname, '../../seeds',)],
  synchronize: true,
});