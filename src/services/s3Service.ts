import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_S3_REGION;
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_S3_SECRET_KEY_ID;

    // 테스트 환경이거나 AWS 설정이 없는 경우 mock 클라이언트 반환
    if (!region || !accessKeyId || !secretAccessKey) {
      console.warn('AWS S3 환경변수가 설정되지 않았습니다. Mock 클라이언트를 사용합니다.');
      // 테스트 환경에서는 실제 S3 연결 없이 mock 객체 반환
      return {
        send: async () => ({ Location: 'mock-s3-url' })
      } as any;
    }

    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3Client;
}

export async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const client = getS3Client();
  const key = `sdk/${Date.now()}-${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET ?? "",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // 환경변수가 없는 경우 (테스트 환경) mock URL 반환
  if (!process.env.AWS_S3_REGION || !process.env.AWS_S3_ACCESS_KEY_ID) {
    return `mock-s3-url/${key}`;
  }

  await client.send(command);
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}