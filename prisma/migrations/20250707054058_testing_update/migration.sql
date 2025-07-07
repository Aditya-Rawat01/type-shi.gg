/*
  Warnings:

  - You are about to drop the column `bestStats` on the `BestStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BestStats" DROP COLUMN "bestStats",
ADD COLUMN     "time15" JSONB NOT NULL DEFAULT '{ "accuracy": 0, "rawWpm": 0, "avgWpm": 0 }';
