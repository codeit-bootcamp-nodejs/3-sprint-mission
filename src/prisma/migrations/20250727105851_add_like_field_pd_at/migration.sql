-- CreateTable
CREATE TABLE "_UserLikeProduct" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserLikeProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserLikeArticle" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserLikeArticle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserLikeProduct_B_index" ON "_UserLikeProduct"("B");

-- CreateIndex
CREATE INDEX "_UserLikeArticle_B_index" ON "_UserLikeArticle"("B");

-- AddForeignKey
ALTER TABLE "_UserLikeProduct" ADD CONSTRAINT "_UserLikeProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikeProduct" ADD CONSTRAINT "_UserLikeProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikeArticle" ADD CONSTRAINT "_UserLikeArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikeArticle" ADD CONSTRAINT "_UserLikeArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
