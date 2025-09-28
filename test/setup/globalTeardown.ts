import prisma from "../../src/config/prisma";

export default async function globalTeardown() {
  console.log("Global Teardown: 데이터베이스 연결 해제");
  await prisma.$disconnect();
}