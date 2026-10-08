import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type S3Config, type S3Item, type S3ListResult } from "utils/s3/types";
import { getMimeType } from "utils/functions";

const S3_CONFIG_STORAGE_KEY = "daedalos_aws_s3_config";

export const getStoredS3Config = (): S3Config | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(S3_CONFIG_STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as S3Config;
  } catch {
    return undefined;
  }
};

export const saveStoredS3Config = (config: S3Config): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(S3_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
};

export const clearStoredS3Config = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(S3_CONFIG_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

export const createS3Client = (config: S3Config): S3Client => {
  return new S3Client({
    region: config.region || "ap-south-1",
    credentials: {
      accessKeyId: config.accessKeyId.trim(),
      secretAccessKey: config.secretAccessKey.trim(),
      sessionToken: config.sessionToken?.trim() || undefined,
    },
    ...(config.endpoint ? { endpoint: config.endpoint.trim() } : {}),
  });
};

export const testS3Connection = async (
  config: S3Config
): Promise<{ success: boolean; message?: string }> => {
  try {
    const client = createS3Client(config);
    // Attempt to head the bucket or list with maxKeys = 1
    const command = new ListObjectsV2Command({
      Bucket: config.bucket.trim(),
      MaxKeys: 1,
    });
    await client.send(command);
    return { success: true };
  } catch (error: unknown) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to connect to AWS S3 bucket.",
      success: false,
    };
  }
};

export const listS3Objects = async (
  config: S3Config,
  rawPrefix = ""
): Promise<S3ListResult> => {
  const client = createS3Client(config);
  const prefix = rawPrefix
    ? rawPrefix.endsWith("/")
      ? rawPrefix
      : `${rawPrefix}/`
    : "";

  const command = new ListObjectsV2Command({
    Bucket: config.bucket.trim(),
    Prefix: prefix,
    Delimiter: "/",
  });

  const response = await client.send(command);

  const folders: S3Item[] = (response.CommonPrefixes || [])
    .map((item) => {
      const fullKey = item.Prefix || "";
      // Strip trailing slash and prefix to get display name
      const withoutTrailing = fullKey.replace(/\/$/, "");
      const name = withoutTrailing.slice(prefix.length);
      return {
        key: fullKey,
        name: name || fullKey,
        isFolder: true,
        size: 0,
      };
    })
    .filter((f) => Boolean(f.name));

  const files: S3Item[] = (response.Contents || [])
    .map((item) => {
      const fullKey = item.Key || "";
      const name = fullKey.slice(prefix.length);
      return {
        key: fullKey,
        name,
        isFolder: false,
        size: item.Size || 0,
        lastModified: item.LastModified,
        storageClass: item.StorageClass,
        etag: item.ETag,
      };
    })
    // Filter out the directory marker itself if prefix matches key exactly
    .filter((f) => Boolean(f.name) && !f.name.endsWith("/"));

  return { folders, files, prefix };
};

export const getS3ObjectData = async (
  config: S3Config,
  key: string
): Promise<{ buffer: Buffer; contentType: string }> => {
  const client = createS3Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket.trim(),
    Key: key,
  });

  const response = await client.send(command);
  const bytes = await response.Body?.transformToByteArray?.();
  const buffer = Buffer.from(bytes || []);
  const contentType =
    response.ContentType || getMimeType(key) || "application/octet-stream";

  return { buffer, contentType };
};

export const putS3Object = async (
  config: S3Config,
  key: string,
  body: Uint8Array | Buffer | string | Blob,
  customContentType?: string
): Promise<void> => {
  const client = createS3Client(config);
  const contentType =
    customContentType || getMimeType(key) || "application/octet-stream";

  let uploadBody: Uint8Array | Buffer | string =
    typeof body === "string" ||
    Buffer.isBuffer(body) ||
    body instanceof Uint8Array
      ? body
      : new Uint8Array();
  if (typeof Blob !== "undefined" && body instanceof Blob) {
    const arrayBuffer = await body.arrayBuffer();
    uploadBody = new Uint8Array(arrayBuffer);
  }

  const command = new PutObjectCommand({
    Bucket: config.bucket.trim(),
    ContentType: contentType,
    Key: key,
    Body: uploadBody,
  });

  await client.send(command);
};

export const createS3Folder = async (
  config: S3Config,
  folderPath: string
): Promise<void> => {
  const normalizedKey = folderPath.replace(/\/?$/, "/");
  await putS3Object(
    config,
    normalizedKey,
    new Uint8Array(0),
    "application/x-directory"
  );
};

export const deleteS3Object = async (
  config: S3Config,
  key: string
): Promise<void> => {
  const client = createS3Client(config);
  const command = new DeleteObjectCommand({
    Bucket: config.bucket.trim(),
    Key: key,
  });
  await client.send(command);
};

export const deleteS3Prefix = async (
  config: S3Config,
  prefix: string
): Promise<void> => {
  const client = createS3Client(config);
  // List all objects recursively under prefix
  const listCommand = new ListObjectsV2Command({
    Bucket: config.bucket.trim(),
    Prefix: prefix,
  });
  const listResp = await client.send(listCommand);
  const objectsToDelete = (listResp.Contents || []).map((o) => ({
    Key: o.Key,
  }));

  if (objectsToDelete.length > 0) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: config.bucket.trim(),
      Delete: {
        Objects: objectsToDelete,
      },
    });
    await client.send(deleteCommand);
  }
};

export const getS3PresignedUrl = async (
  config: S3Config,
  key: string,
  expiresIn = 3600
): Promise<string> => {
  const client = createS3Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket.trim(),
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
};
