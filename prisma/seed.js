import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tag1 = await prisma.tag.create({ data: { tag: '전자기기' } });
  const tag2 = await prisma.tag.create({ data: { tag: '중고' } });

  await prisma.product.create({
    data: {
      name: '중고 아이폰',
      description: '상태 매우 좋음',
      price: 450000,
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }]
      }
    }
  });

  await prisma.article.create({
    data: {
      title: '첫 번째 게시글',
      content: '여기에 글 내용이 들어갑니다.'
    }
  });
}

main()
  .then(async () => {
    console.log('🌱 Seeding complete');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
