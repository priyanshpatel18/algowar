-- CreateEnum
CREATE TYPE "AUTH_PROVIDER" AS ENUM ('GUEST');

-- CreateEnum
CREATE TYPE "GAME_RESULT" AS ENUM ('PLAYER_ONE_WINS', 'PLAYER_TWO_WINS', 'DRAW');

-- CreateEnum
CREATE TYPE "GAME_STATUS" AS ENUM ('WAITING_FOR_OPPONENT', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'TIMEOUT', 'PLAYER_EXIT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "provider" "AUTH_PROVIDER" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "status" "GAME_STATUS" NOT NULL DEFAULT 'IN_PROGRESS',
    "result" "GAME_RESULT" NOT NULL DEFAULT 'DRAW',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");

-- CreateIndex
CREATE INDEX "Game_status_result_idx" ON "Game"("status", "result");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToUser_AB_unique" ON "_GameToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToUser_B_index" ON "_GameToUser"("B");

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
