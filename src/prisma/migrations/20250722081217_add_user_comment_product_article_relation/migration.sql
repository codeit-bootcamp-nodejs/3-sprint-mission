-- AlterTable
ALTER TABLE "ArticleComment" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "ProductComment" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductComment" ADD CONSTRAINT "ProductComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
