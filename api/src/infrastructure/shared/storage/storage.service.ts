import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { IStorageInterface } from 'src/domain/shared/storage.interface';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class StorageService implements IStorageInterface {
  private readonly client: S3Client;
  private readonly region: string;
  private readonly bucket: string;

  constructor(
    settingsService: SettingsService, //
  ) {
    this.region = settingsService.getAWSRegion();
    this.bucket = settingsService.getAWSBucket();

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: settingsService.getAWSAccessKeyId(),
        secretAccessKey: settingsService.getAWSAccessKeySecret(),
      },
    });
  }

  async uploadFile(
    buffer: Buffer,
    path: string,
    contentType: string,
  ): Promise<string> {
    const hash = randomBytes(16).toString('hex').replace(/\//gi, '-');
    const key = `${path}/${hash}`;

    await this.client.send(
      new PutObjectCommand({
        Body: buffer,
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      }),
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
