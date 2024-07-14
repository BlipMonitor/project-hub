-- CreateTable
CREATE TABLE "TransactionVolume" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorRate" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasUsage" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "gasUsed" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GasUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniqueUsers" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniqueUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseTime" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponseTime_pkey" PRIMARY KEY ("id")
);
