-- CreateTable
CREATE TABLE "BestStats" (
    "id" TEXT NOT NULL,
    "bestStats" JSONB NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BestStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BestStats_userId_key" ON "BestStats"("userId");

-- AddForeignKey
ALTER TABLE "BestStats" ADD CONSTRAINT "BestStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
