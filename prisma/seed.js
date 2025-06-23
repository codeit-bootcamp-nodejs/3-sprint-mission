// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Start seeding ---');

  try {
    await prisma.article_comments.deleteMany({});
    await prisma.product_comments.deleteMany({});
    await prisma.products.deleteMany({});
    await prisma.articles.deleteMany({});
    await prisma.users.deleteMany({});
    console.log('Existing data cleared.');
  } catch (e) {
    console.warn('Could not clear existing data. This might be normal if tables are empty or relations prevent deletion:', e.message);
  }

  const user1 = await prisma.users.create({
    data: {
      username: '개발자김',
      email: 'dev.kim@example.com',
      address: '서울시 강남구 테헤란로',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created user: ${user1.username} (ID: ${user1.id})`);

  const user2 = await prisma.users.create({
    data: {
      username: '디자이너이',
      email: 'designer.lee@example.com',
      address: '경기도 성남시 분당구',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created user: ${user2.username} (ID: ${user2.id})`);

  const user3 = await prisma.users.create({
    data: {
      username: '기획자박',
      email: 'planner.park@example.com',
      address: '부산시 해운대구',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created user: ${user3.username} (ID: ${user3.id})`);

  const product1 = await prisma.products.create({
    data: {
      name: '노드JS 마스터 가이드 북 (새상품)',
      description: 'Node.js의 비동기 처리, 스트림, 클러스터링 등 심화 내용을 다룹니다. 초보자부터 숙련자까지.',
      price: 45000.00,
      isSold: false,
      tags: ['NEW_PRODUCT', 'BOOKS', 'FREE_SHIPPING'],
      stock: 3,
      usersId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created product: ${product1.name} (ID: ${product1.id})`);

  const product2 = await prisma.products.create({
    data: {
      name: '중고 아이폰 13 프로 (A급)',
      description: '배터리 효율 90%, 생활 기스 약간. 케이스와 필름 부착하고 사용하여 깨끗합니다.',
      price: 850000.00,
      isSold: false,
      tags: ['A_GRADE', 'ELECTRONICS', 'PRICE_NEGOTIABLE'],
      stock: 1,
      usersId: user2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created product: ${product2.name} (ID: ${product2.id})`);

  const product3 = await prisma.products.create({
    data: {
      name: '리미티드 에디션 스니커즈 (270mm)',
      description: '수집가들을 위한 한정판 스니커즈. 미개봉 상태입니다.',
      price: 300000.00,
      isSold: false,
      tags: ['LIMITED_EDITION', 'CLOTHING', 'DIRECT_DEAL'],
      stock: 1,
      usersId: user3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created product: ${product3.name} (ID: ${product3.id})`);

  const article1 = await prisma.articles.create({
    data: {
      title: 'Prisma 마이그레이션 전략에 대한 고찰',
      content: '개발 초기 단계와 운영 단계에서의 Prisma 마이그레이션 전략에 대해 깊이 있게 다뤄봅니다. 여러분의 경험도 공유해주세요!',
      imageUrl: 'https://picsum.photos/seed/prisma/600/400',
      usersId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created article: ${article1.title} (ID: ${article1.id})`);

  const article2 = await prisma.articles.create({
    data: {
      title: 'Express 미들웨어 최적화 방법',
      content: '수많은 미들웨어를 효율적으로 관리하고 Express 앱의 성능을 최적화하는 팁들을 공유합니다.',
      imageUrl: 'https://picsum.photos/seed/express/600/400',
      usersId: user2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created article: ${article2.title} (ID: ${article2.id})`);

  await prisma.product_comments.create({
    data: {
      content: '이 책 정말 내용이 알차 보여요! 혹시 목차 사진 볼 수 있을까요?',
      productsId: product1.id,
      usersId: user2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created product comment for product: ${product1.name}`);

  await prisma.product_comments.create({
    data: {
      content: '직거래 시 가격 네고 가능할까요? 구매 희망합니다!',
      productsId: product2.id,
      usersId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created product comment for product: ${product2.name}`);

  await prisma.article_comments.create({
    data: {
      content: '좋은 글 감사합니다. 저도 마이그레이션 때문에 고민이 많았는데 큰 도움이 됐어요.',
      articlesId: article1.id,
      usersId: user3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created article comment for article: ${article1.title}`);

  await prisma.article_comments.create({
    data: {
      content: 'Render.com 배포 관련해서 더 자세한 내용도 알려주실 수 있나요?',
      articlesId: article2.id,
      usersId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(`Created article comment for article: ${article2.title}`);

  console.log('--- Seeding finished ---');
}

main()
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });