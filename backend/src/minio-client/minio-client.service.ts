import * as crypto from 'node:crypto';
import type internal from 'node:stream';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';

import { AppLogger } from '@/common/service';

import type { BufferedFile } from './model';

@Injectable()
export class MinioClientService {
  public constructor(
    private readonly minio: MinioService,
    private readonly logger: AppLogger
  ) {}

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
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST
      );
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
    } catch {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }

    return {
      url: MinioClientService.getObjectLink(fileName, 'books'),
      fileName,
    };
  }

  public async delete(objetName: string, bucketName: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName, objetName);
    } catch {
      throw new HttpException(
        'An error occured when deleting!',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async get(
    bucketName: string,
    objectName: string
  ): Promise<internal.Readable> {
    try {
      return await this.client.getObject(bucketName, objectName);
    } catch {
      throw new HttpException(
        'An error occured when getting!',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public static getObjectLink(objectName: string, bucketName: string): string {
    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
  }
}
