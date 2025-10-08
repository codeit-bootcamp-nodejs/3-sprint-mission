declare module 'multer-s3' {
  import { StorageEngine } from 'multer'
  import { S3Client } from '@aws-sdk/client-s3'

  interface MulterS3Options {
    s3: S3Client
    bucket: string
    acl?: string
    key?: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => void
    contentType?: (req: Express.Request, file: Express.Multer.File, cb: (error: any, mime?: string) => void) => void
    metadata?: (req: Express.Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => void
  }

  export default function multerS3(options: MulterS3Options): StorageEngine
}
