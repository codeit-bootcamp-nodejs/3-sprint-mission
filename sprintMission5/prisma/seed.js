import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 유저 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      nickname: '테스트유저',
      password: 'hashed-password',
      image: 'https://example.com/avatar.png',
    },
  });

  // 게시글 생성
  const article = await prisma.article.create({
    data: {
      title: '첫 번째 글',
      content: '이건 예시 글입니다.',
      userId: user.id,
    },
  });

  // 상품 생성
  const product = await prisma.product.create({
    data: {
      name: '예시 상품',
      description: '좋은 상품입니다.',
      price: 10000,
      tags: ['추천', '인기'],
      userId: user.id,
    },
  });

  // 댓글 생성 (게시글용)
  await prisma.comment.create({
    data: {
      content: '좋은 글이네요!',
      userId: user.id,
      articleId: article.id,
    },
  });

  // 댓글 생성 (상품용)
  await prisma.comment.create({
    data: {
      content: '이 상품 좋아요!',
      userId: user.id,
      productId: product.id,
    },
  });

  // 좋아요 생성
  await prisma.articleLike.create({
    data: {
      userId: user.id,
      articleId: article.id,
    },
  });

  await prisma.productLike.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  });

  console.log('🌱 시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 실패:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());