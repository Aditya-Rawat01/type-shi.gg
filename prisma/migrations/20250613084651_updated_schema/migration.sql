-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,
    "charSets" INTEGER[],
    "mode" TEXT NOT NULL,
    "totalChars" INTEGER NOT NULL,
    "consistency" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
