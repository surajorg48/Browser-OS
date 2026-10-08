export type S3Config = {
  accessKeyId: string;
  bucket: string;
  endpoint?: string;
  region: string;
  sessionToken?: string;
  secretAccessKey: string;
};

export type S3Item = {
  etag?: string;
  isFolder: boolean;
  key: string;
  lastModified?: string | Date;
  name: string;
  size: number;
  storageClass?: string;
};

export type S3ListResult = {
  files: S3Item[];
  folders: S3Item[];
  prefix: string;
};
