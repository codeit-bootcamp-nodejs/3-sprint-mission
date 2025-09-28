import { PrismaClient } from '@prisma/client';
import sample from './mock';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Start Seeding...')
  // 기존 데이터 삭제
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.articleComment.deleteMany({});
  await prisma.productComment.deleteMany({});

  // 시딩 데이터 삽입
  await prisma.product.createMany({ data: sample.products });
  await prisma.article.createMany({ data: sample.articles });
  await prisma.articleComment.createMany({ data: sample.articleComments });
  await prisma.productComment.createMany({ data: sample.productComments });
};

main()
  .then(() => {
    console.log('Finish Seeding!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });