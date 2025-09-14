-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PRICE_CHANGE', 'NEW_COMMENT');

-- CreateEnum
CREATE TYPE "NotificationEntity" AS ENUM ('PRODUCT', 'COMMENT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "entityType" "NotificationEntity" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "dedupKey" VARCHAR(128),
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_unread" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_dedup" ON "Notification"("userId", "type", "entityType", "entityId", "dedupKey");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
