/*
  Warnings:

  - Added the required column `time120` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time30` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time60` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words10` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words100` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words25` to the `BestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words50` to the `BestStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BestStats" ADD COLUMN     "time120" JSONB NOT NULL,
ADD COLUMN     "time30" JSONB NOT NULL,
ADD COLUMN     "time60" JSONB NOT NULL,
ADD COLUMN     "words10" JSONB NOT NULL,
ADD COLUMN     "words100" JSONB NOT NULL,
ADD COLUMN     "words25" JSONB NOT NULL,
ADD COLUMN     "words50" JSONB NOT NULL;
