export interface IStorageInterface {
  uploadFile(
    buffer: Buffer,
    path: string,
    contentType: string,
  ): Promise<string>;

  deleteFile(key: string): Promise<void>;
}
