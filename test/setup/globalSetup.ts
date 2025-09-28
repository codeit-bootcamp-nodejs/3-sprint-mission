import dotenv from "dotenv";
import path from "path";
import prisma from "../../src/config/prisma";
import seedDatabase from "../utils/seed";

export default async function globalSetup() {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.test"),
    override: true,
  });

  console.log("Global Setup: 데이터베이스 연결 및 초기화 시작");
  
  await prisma.$connect();
  
  await prisma.notification.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await seedDatabase();
  
  console.log("Global Setup: 데이터베이스 초기화 완료");
}