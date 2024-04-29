import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './model';
import * as crypto from 'crypto';
import { AppLogger } from '@/common/service';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService, private readonly logger: AppLogger) {}

  public get client() {
    return this.minio.client;
  }

  public async upload(file: BufferedFile, bucketName: string) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png') || file.mimetype.includes('pdf'))) {
      throw new HttpException('File type not supported', HttpStatus.BAD_REQUEST);
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

    const fileName = hashedFileName + extension;

    try {
      await this.client.putObject(bucketName, fileName, file.buffer);
    } catch (error) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }

    return {
      url: MinioClientService.getObjectLink(fileName, 'books'),
      fileName,
    };
  }

  async delete(objetName: string, bucketName: string) {
    try {
      await this.client.removeObject(bucketName, objetName);
    } catch (error) {
      throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST);
    }
  }

  async get(bucketName: string, objectName: string) {
    try {
      const object = await this.client.getObject(bucketName, objectName);
      return object;
    } catch (error) {
      throw new HttpException('An error occured when getting!', HttpStatus.BAD_REQUEST);
    }
  }

  public static getObjectLink(objectName: string, bucketName: string) {
    return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
  }
}
