import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // ---------------------
  // 1. Users
  // ---------------------
  const users = await Promise.all([
    prisma.user.create({
      data: { email: "alice@test.com", nickname: "Alice", password: "hashed1" },
    }),
    prisma.user.create({
      data: { email: "bob@test.com", nickname: "Bob", password: "hashed2" },
    }),
    prisma.user.create({
      data: { email: "carol@test.com", nickname: "Carol", password: "hashed3" },
    }),
  ]);

  const [alice, bob, carol] = users;

  // ---------------------
  // 2. Products
  // ---------------------
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Laptop",
        description: "High-end laptop",
        price: 1500,
        tags: ["electronics", "computer"],
        userId: alice.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Book",
        description: "Interesting book",
        price: 20,
        tags: ["book", "education"],
        userId: bob.id,
      },
    }),
  ]);

  const [laptop, book] = products;

  // ---------------------
  // 3. Articles
  // ---------------------
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "First Article",
        content: "This is the first article",
        userId: alice.id,
      },
    }),
    prisma.article.create({
      data: {
        title: "Second Article",
        content: "This is the second article",
        userId: bob.id,
      },
    }),
  ]);

  const [article1, article2] = articles;

  // ---------------------
  // 4. Comments
  // ---------------------
  await Promise.all([
    prisma.comment.create({
      data: { content: "Great product!", productId: laptop.id, userId: bob.id },
    }),
    prisma.comment.create({
      data: { content: "I love this article", articleId: article1.id, userId: carol.id },
    }),
    prisma.comment.create({
      data: { content: "Nice book", productId: book.id, userId: alice.id },
    }),
  ]);

  // ---------------------
  // 5. Product Likes
  // ---------------------
  await Promise.all([
    prisma.productLike.create({ data: { productId: laptop.id, userId: bob.id } }),
    prisma.productLike.create({ data: { productId: book.id, userId: carol.id } }),
  ]);

  // ---------------------
  // 6. Article Likes
  // ---------------------
  await Promise.all([
    prisma.articleLike.create({ data: { articleId: article1.id, userId: bob.id } }),
    prisma.articleLike.create({ data: { articleId: article2.id, userId: carol.id } }),
  ]);

  // ---------------------
  // 7. Notifications
  // ---------------------
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: alice.id,
        type: NotificationType.LIKE,
        message: "Bob liked your product",
      },
    }),
    prisma.notification.create({
      data: {
        userId: bob.id,
        type: NotificationType.COMMENT,
        message: "Carol commented on your article",
      },
    }),
    prisma.notification.create({
      data: {
        userId: carol.id,
        type: NotificationType.LIKE,
        message: "Alice liked your article",
      },
    }),
  ]);

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;