export interface ISettings {
  getRabbitMQUrl(): string;
  getAWSAccessKeyId(): string;
  getAWSAccessKeySecret(): string;
  getAWSBucket(): string;
  getAWSRegion(): string;
  getJWTSecretKey(): string;
}
