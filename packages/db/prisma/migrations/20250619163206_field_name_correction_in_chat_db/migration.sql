/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_message_fkey";

-- DropIndex
DROP INDEX "Chat_message_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message",
ADD COLUMN     "messageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_messageId_key" ON "Chat"("messageId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Drawing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
