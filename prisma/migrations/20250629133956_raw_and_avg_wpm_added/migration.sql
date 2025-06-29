/*
  Warnings:

  - Added the required column `avgWpm` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawWpm` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "avgWpm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rawWpm" DOUBLE PRECISION NOT NULL;
