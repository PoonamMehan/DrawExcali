/*
  Warnings:

  - A unique constraint covering the columns `[message]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `message` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message",
ADD COLUMN     "message" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Drawing" (
    "id" SERIAL NOT NULL,
    "shapeName" TEXT NOT NULL,
    "startX" INTEGER NOT NULL,
    "startY" INTEGER NOT NULL,
    "endX" INTEGER NOT NULL,
    "endY" INTEGER NOT NULL,
    "text" TEXT,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_message_key" ON "Chat"("message");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_message_fkey" FOREIGN KEY ("message") REFERENCES "Drawing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
