-- CreateTable
CREATE TABLE "DailyTransactionVolume" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTransactionVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyErrorRate" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyErrorRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyGasUsage" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "gasUsed" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyGasUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyUniqueUsers" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "uniqueUsers" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyUniqueUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyResponseTime" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "averageResponseTime" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyResponseTime_pkey" PRIMARY KEY ("id")
);
