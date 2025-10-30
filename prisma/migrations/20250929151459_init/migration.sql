-- CreateTable
CREATE TABLE "ExampleModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExampleModel_pkey" PRIMARY KEY ("id")
);
