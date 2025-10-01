/**
 * 환경 문제로 cjs로 작성
 */
const prisma = require('../../src/prisma/prismaClient').default;

afterEach(async () => {
  await prisma.notification.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});
