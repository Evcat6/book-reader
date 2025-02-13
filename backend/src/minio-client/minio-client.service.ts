import * as crypto from 'node:crypto';
import type internal from 'node:stream';

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';

import { AppLogger } from '@/common/service';

import type { BufferedFile } from './model';

@Injectable()
export class MinioClientService {
  public constructor(
    private readonly minio: MinioService,
    private readonly logger: AppLogger
  ) { }

  public get client(): MinioClient {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string
  ): Promise<{
    url: string;
    fileName: string;
  }> {
    if (
      !(
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('pdf')
      )
    ) {
      this.logger.error(`file type(${file.mimetype}) is not supported`);
      throw new BadRequestException('File type not supported');
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.slice(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    );

    const fileName = hashedFileName + extension;

    try {
      await this.client.putObject(bucketName, fileName, file.buffer);
    } catch (error) {
      this.logger.error(`Error uploading file(${file.originalname}), error message: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error uploading file');
    }

    return {
      url: MinioClientService.getObjectLink(fileName, 'books'),
      fileName,
    };
  }

  public async delete(objectName: string, bucketName: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName, objectName);
    } catch (error) {
      this.logger.error(`Error deleting object(${objectName}) from bucket(${bucketName}), error message: ${(error as Error).message}`)
      throw new InternalServerErrorException('An error occured when deleting!');
    }
  }

  public async get(
    bucketName: string,
    objectName: string
  ): Promise<internal.Readable> {
    try {
      return await this.client.getObject(bucketName, objectName);
    } catch (error) {
      this.logger.error(`Error retrieving object(${objectName}) from bucket(${bucketName}), error message: ${(error as Error).message}`)
      throw new InternalServerErrorException('An error occured when getting file');
    }
  }

  public static getObjectLink(objectName: string, bucketName: string): string {
    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
  }
}
