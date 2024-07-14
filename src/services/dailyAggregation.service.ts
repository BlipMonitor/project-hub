import prisma from '../client';

/**
 * Aggregate daily transaction volume
 */
export const aggregateDailyTransactionVolume = async (): Promise<void> => {
  const result = await prisma.transactionVolume.groupBy({
    by: ['contractId'],
    _sum: {
      transactionCount: true
    },
    where: {
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  });

  await prisma.dailyTransactionVolume.createMany({
    data: result.map((item) => ({
      contractId: item.contractId,
      transactionCount: item._sum.transactionCount ?? 0,
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }))
  });
};

/**
 * Aggregate daily error rate
 */
export const aggregateDailyErrorRate = async (): Promise<void> => {
  const result = await prisma.errorRate.groupBy({
    by: ['contractId', 'errorType'],
    _sum: {
      errorCount: true
    },
    where: {
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  });

  await prisma.dailyErrorRate.createMany({
    data: result.map((item) => ({
      contractId: item.contractId,
      errorType: item.errorType,
      errorCount: item._sum.errorCount ?? 0,
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }))
  });
};

/**
 * Aggregate daily gas usage
 */
export const aggregateDailyGasUsage = async (): Promise<void> => {
  const result = await prisma.gasUsage.groupBy({
    by: ['contractId'],
    _sum: {
      gasUsed: true
    },
    where: {
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  });

  await prisma.dailyGasUsage.createMany({
    data: result.map((item) => ({
      contractId: item.contractId,
      gasUsed: item._sum.gasUsed ?? 0,
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }))
  });
};

/**
 * Aggregate daily unique users
 */
export const aggregateDailyUniqueUsers = async (): Promise<void> => {
  const result = await prisma.uniqueUsers.groupBy({
    by: ['contractId'],
    _count: {
      userAddress: true
    },
    where: {
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  });

  await prisma.dailyUniqueUsers.createMany({
    data: result.map((item) => ({
      contractId: item.contractId,
      uniqueUsers: item._count.userAddress ?? 0,
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }))
  });
};

/**
 * Aggregate daily response time
 */
export const aggregateDailyResponseTime = async (): Promise<void> => {
  const result = await prisma.responseTime.groupBy({
    by: ['contractId'],
    _avg: {
      responseTime: true
    },
    where: {
      timestamp: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  });

  await prisma.dailyResponseTime.createMany({
    data: result.map((item) => ({
      contractId: item.contractId,
      averageResponseTime: item._avg.responseTime ?? 0,
      date: new Date(new Date().setHours(0, 0, 0, 0))
    }))
  });
};

export default {
  aggregateDailyTransactionVolume,
  aggregateDailyErrorRate,
  aggregateDailyGasUsage,
  aggregateDailyUniqueUsers,
  aggregateDailyResponseTime
};
