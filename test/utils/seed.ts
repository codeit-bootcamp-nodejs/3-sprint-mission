import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/passwordUtil";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("Start seeding...");

  // 테스트용 비밀번호 해시
  const hashedPassword1 = await hashPassword("password1");
  const hashedPassword2 = await hashPassword("password2");
  const hashedPassword3 = await hashPassword("password3");
  const hashedPassword4 = await hashPassword("password4");
  const hashedPassword5 = await hashPassword("password5");
  const hashedPassword6 = await hashPassword("password6");

  // ---------------------
  // 1. Users (더 많은 사용자 추가)
  // ---------------------
  const alice = await prisma.user.upsert({
    where: { email: "alice@test.com" },
    update: {},
    create: { email: "alice@test.com", nickname: "Alice", password: hashedPassword1 },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@test.com" },
    update: {},
    create: { email: "bob@test.com", nickname: "Bob", password: hashedPassword2 },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@test.com" },
    update: {},
    create: { email: "carol@test.com", nickname: "Carol", password: hashedPassword3 },
  });

  const david = await prisma.user.upsert({
    where: { email: "david@test.com" },
    update: {},
    create: { email: "david@test.com", nickname: "David", password: hashedPassword4 },
  });

  const eve = await prisma.user.upsert({
    where: { email: "eve@test.com" },
    update: {},
    create: { email: "eve@test.com", nickname: "Eve", password: hashedPassword5 },
  });

  const frank = await prisma.user.upsert({
    where: { email: "frank@test.com" },
    update: {},
    create: { email: "frank@test.com", nickname: "Frank", password: hashedPassword6 },
  });

  const users = [alice, bob, carol, david, eve, frank];

  // ---------------------
  // 2. Products (더 많은 상품 추가)
  // ---------------------
  await prisma.product.deleteMany({
    where: {
      OR: [
        { name: "Laptop" },
        { name: "Book" },
        { name: "Smartphone" },
        { name: "Tablet" },
        { name: "Headphones" },
        { name: "Keyboard" },
        { name: "Mouse" },
        { name: "Monitor" },
        { name: "Coffee Mug" },
        { name: "Notebook" }
      ]
    }
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Laptop",
        description: "High-end gaming laptop with RTX 4080",
        price: 2500,
        tags: ["electronics", "computer", "gaming"],
        userId: alice.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Book",
        description: "Programming fundamentals guide",
        price: 35,
        tags: ["book", "education", "programming"],
        userId: bob.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartphone",
        description: "Latest flagship smartphone",
        price: 1200,
        tags: ["electronics", "mobile", "communication"],
        userId: carol.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Tablet",
        description: "Professional drawing tablet",
        price: 800,
        tags: ["electronics", "design", "art"],
        userId: david.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Headphones",
        description: "Noise-cancelling wireless headphones",
        price: 350,
        tags: ["electronics", "audio", "music"],
        userId: eve.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Keyboard",
        description: "Mechanical gaming keyboard",
        price: 150,
        tags: ["electronics", "computer", "gaming"],
        userId: frank.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mouse",
        description: "Ergonomic wireless mouse",
        price: 80,
        tags: ["electronics", "computer", "office"],
        userId: alice.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Monitor",
        description: "4K Ultra HD gaming monitor",
        price: 600,
        tags: ["electronics", "computer", "gaming"],
        userId: bob.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Coffee Mug",
        description: "Insulated travel coffee mug",
        price: 25,
        tags: ["kitchenware", "travel", "coffee"],
        userId: carol.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Notebook",
        description: "Premium leather-bound notebook",
        price: 45,
        tags: ["stationery", "writing", "premium"],
        userId: david.id,
      },
    }),
  ]);

  const [laptop, book, smartphone, tablet, headphones, keyboard, mouse, monitor, coffeeMug, notebook] = products;

  // ---------------------
  // 3. Articles (더 많은 게시글 추가)
  // ---------------------
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "Getting Started with React",
        content: "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 요소를 만들 수 있습니다.",
        userId: alice.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "TypeScript Best Practices",
        content: "TypeScript를 효과적으로 사용하기 위한 모범 사례들을 소개합니다. 타입 안정성과 개발 생산성을 높이는 방법을 알아보세요.",
        userId: bob.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "Database Design Fundamentals",
        content: "좋은 데이터베이스 설계의 기본 원칙들을 다룹니다. 정규화, 인덱싱, 성능 최적화에 대해 알아보세요.",
        userId: carol.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "Modern CSS Techniques",
        content: "CSS Grid, Flexbox, 그리고 최신 CSS 기능들을 활용한 현대적인 웹 디자인 기법을 소개합니다.",
        userId: david.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "API Design Guidelines",
        content: "RESTful API 설계 원칙과 GraphQL의 장점을 비교 분석합니다. 확장 가능한 API 아키텍처 구축 방법을 제시합니다.",
        userId: eve.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "Testing Strategies for Web Apps",
        content: "유닛 테스트, 통합 테스트, E2E 테스트까지 웹 애플리케이션의 전체적인 테스팅 전략을 다룹니다.",
        userId: frank.id,
      },
    }),
  ]);

  const [article1, article2, article3, article4, article5, article6] = articles;

  // ---------------------
  // 4. Comments (더 많은 댓글 추가)
  // ---------------------
  await Promise.all([
    // Product comments
    prisma.comment.create({
      data: { content: "정말 좋은 성능의 노트북이네요! 게임도 잘 돌아갑니다.", productId: laptop.id, userId: bob.id },
    }),
    prisma.comment.create({
      data: { content: "가격이 조금 비싸긴 하지만 성능을 생각하면 합리적이네요.", productId: laptop.id, userId: carol.id },
    }),
    prisma.comment.create({
      data: { content: "프로그래밍 입문자에게 강추하는 책입니다!", productId: book.id, userId: alice.id },
    }),
    prisma.comment.create({
      data: { content: "설명이 아주 자세하고 이해하기 쉬워요.", productId: book.id, userId: david.id },
    }),
    prisma.comment.create({
      data: { content: "카메라 화질이 정말 좋네요. 사진 찍는 재미가 있어요.", productId: smartphone.id, userId: eve.id },
    }),
    prisma.comment.create({
      data: { content: "배터리도 오래가고 전반적으로 만족합니다.", productId: smartphone.id, userId: frank.id },
    }),
    prisma.comment.create({
      data: { content: "디지털 드로잉하기에 아주 좋은 태블릿입니다.", productId: tablet.id, userId: alice.id },
    }),
    prisma.comment.create({
      data: { content: "노이즈 캔슬링 기능이 정말 뛰어나요!", productId: headphones.id, userId: bob.id },
    }),
    prisma.comment.create({
      data: { content: "타건감이 정말 좋습니다. 게임할 때 만족도가 높아요.", productId: keyboard.id, userId: carol.id },
    }),
    prisma.comment.create({
      data: { content: "화질이 선명하고 색감도 좋네요.", productId: monitor.id, userId: david.id },
    }),

    // Article comments
    prisma.comment.create({
      data: { content: "React 초보자에게 도움이 많이 되는 글이네요!", articleId: article1.id, userId: carol.id },
    }),
    prisma.comment.create({
      data: { content: "컴포넌트 설계 부분이 특히 유익했습니다.", articleId: article1.id, userId: david.id },
    }),
    prisma.comment.create({
      data: { content: "TypeScript를 제대로 활용하는 방법을 배웠습니다.", articleId: article2.id, userId: eve.id },
    }),
    prisma.comment.create({
      data: { content: "타입 정의하는 방법이 명확하게 설명되어 있어요.", articleId: article2.id, userId: frank.id },
    }),
    prisma.comment.create({
      data: { content: "데이터베이스 설계할 때 참고하겠습니다!", articleId: article3.id, userId: alice.id },
    }),
    prisma.comment.create({
      data: { content: "정규화에 대한 설명이 이해하기 쉬웠어요.", articleId: article3.id, userId: bob.id },
    }),
    prisma.comment.create({
      data: { content: "CSS Grid 사용법을 자세히 알 수 있었습니다.", articleId: article4.id, userId: carol.id },
    }),
    prisma.comment.create({
      data: { content: "API 설계할 때 많은 도움이 될 것 같아요.", articleId: article5.id, userId: david.id },
    }),
    prisma.comment.create({
      data: { content: "테스트 전략에 대해 체계적으로 배울 수 있었습니다.", articleId: article6.id, userId: eve.id },
    }),
  ]);

  // ---------------------
  // 5. Product Likes (더 많은 좋아요 추가)
  // ---------------------
  await Promise.all([
    prisma.productLike.create({ data: { productId: laptop.id, userId: bob.id } }),
    prisma.productLike.create({ data: { productId: laptop.id, userId: carol.id } }),
    prisma.productLike.create({ data: { productId: laptop.id, userId: david.id } }),
    prisma.productLike.create({ data: { productId: book.id, userId: alice.id } }),
    prisma.productLike.create({ data: { productId: book.id, userId: carol.id } }),
    prisma.productLike.create({ data: { productId: smartphone.id, userId: alice.id } }),
    prisma.productLike.create({ data: { productId: smartphone.id, userId: bob.id } }),
    prisma.productLike.create({ data: { productId: tablet.id, userId: bob.id } }),
    prisma.productLike.create({ data: { productId: tablet.id, userId: eve.id } }),
    prisma.productLike.create({ data: { productId: headphones.id, userId: alice.id } }),
    prisma.productLike.create({ data: { productId: headphones.id, userId: carol.id } }),
    prisma.productLike.create({ data: { productId: headphones.id, userId: frank.id } }),
    prisma.productLike.create({ data: { productId: keyboard.id, userId: alice.id } }),
    prisma.productLike.create({ data: { productId: monitor.id, userId: carol.id } }),
    prisma.productLike.create({ data: { productId: monitor.id, userId: eve.id } }),
    prisma.productLike.create({ data: { productId: coffeeMug.id, userId: alice.id } }),
    prisma.productLike.create({ data: { productId: coffeeMug.id, userId: bob.id } }),
    prisma.productLike.create({ data: { productId: notebook.id, userId: eve.id } }),
    prisma.productLike.create({ data: { productId: notebook.id, userId: frank.id } }),
  ]);

  // ---------------------
  // 6. Article Likes (더 많은 좋아요 추가)
  // ---------------------
  await Promise.all([
    prisma.articleLike.create({ data: { articleId: article1.id, userId: bob.id } }),
    prisma.articleLike.create({ data: { articleId: article1.id, userId: carol.id } }),
    prisma.articleLike.create({ data: { articleId: article1.id, userId: david.id } }),
    prisma.articleLike.create({ data: { articleId: article2.id, userId: alice.id } }),
    prisma.articleLike.create({ data: { articleId: article2.id, userId: carol.id } }),
    prisma.articleLike.create({ data: { articleId: article2.id, userId: eve.id } }),
    prisma.articleLike.create({ data: { articleId: article3.id, userId: alice.id } }),
    prisma.articleLike.create({ data: { articleId: article3.id, userId: bob.id } }),
    prisma.articleLike.create({ data: { articleId: article4.id, userId: bob.id } }),
    prisma.articleLike.create({ data: { articleId: article4.id, userId: eve.id } }),
    prisma.articleLike.create({ data: { articleId: article5.id, userId: carol.id } }),
    prisma.articleLike.create({ data: { articleId: article5.id, userId: frank.id } }),
    prisma.articleLike.create({ data: { articleId: article6.id, userId: alice.id } }),
    prisma.articleLike.create({ data: { articleId: article6.id, userId: david.id } }),
  ]);

  // ---------------------
  // 7. Notifications (더 많은 알림 추가)
  // ---------------------

  console.log("Seeding finished!");
  
  return {
    users: { alice, bob, carol, david, eve, frank },
    products: { laptop, book, smartphone, tablet, headphones, keyboard, mouse, monitor, coffeeMug, notebook },
    articles: { article1, article2, article3, article4, article5, article6 }
  };
}

export default seedDatabase;