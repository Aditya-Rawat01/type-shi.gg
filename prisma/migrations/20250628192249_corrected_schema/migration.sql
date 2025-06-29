/*
  Warnings:

  - You are about to drop the column `consistency` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `totalChars` on the `Test` table. All the data in the column will be lost.
  - Added the required column `flameGraph` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "consistency",
DROP COLUMN "duration",
DROP COLUMN "totalChars",
ADD COLUMN     "flameGraph" JSONB NOT NULL;
