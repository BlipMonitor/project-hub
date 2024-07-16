-- CreateTable
CREATE TABLE "ContractInteraction" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "ledgerSequence" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "parameters" JSONB,
    "result" JSONB,
    "status" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMetric" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,
    "totalInteractions" INTEGER NOT NULL,
    "averageLedgerSequence" INTEGER NOT NULL,
    "minLedgerSequence" INTEGER NOT NULL,
    "maxLedgerSequence" INTEGER NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "uniqueOperationsCount" INTEGER NOT NULL,
    "topFunctions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "details" JSONB,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertConfiguration" (
    "id" SERIAL NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "timeWindow" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AlertConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "alertId" INTEGER NOT NULL,
    "notificationType" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyMetric_date_contractId_key" ON "DailyMetric"("date", "contractId");

-- CreateIndex
CREATE INDEX "Alert_id_idx" ON "Alert"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertConfiguration_contractAddress_alertType_key" ON "AlertConfiguration"("contractAddress", "alertType");

-- CreateIndex
CREATE INDEX "Notification_alertId_idx" ON "Notification"("alertId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
