import prisma from '../client';

/**
 * Record transaction volume
 * @param {string} contractId - The contract ID
 * @returns {Promise<void>}
 */
export const recordTransaction = async (contractId: string): Promise<void> => {
  await prisma.transactionVolume.create({
    data: {
      contractId,
      transactionCount: 1
    }
  });
};

/**
 * Get transaction volume
 * @param {string} contractId - The contract ID
 * @param {string} timeRange - The time range
 * @returns {Promise<number>}
 */
export const getTransactionVolume = async (
  contractId: string,
  timeRange: string
): Promise<number> => {
  const result = await prisma.transactionVolume.findMany({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    },
    select: {
      transactionCount: true
    }
  });
  return result.reduce((acc, curr) => acc + curr.transactionCount, 0);
};

/**
 * Record error rate
 * @param {string} contractId - The contract ID
 * @param {string} errorType - The error type
 * @returns {Promise<void>}
 */
export const recordError = async (contractId: string, errorType: string): Promise<void> => {
  await prisma.errorRate.create({
    data: {
      contractId,
      errorType,
      errorCount: 1
    }
  });
};

/**
 * Get error rate
 * @param {string} contractId - The contract ID
 * @param {string} timeRange - The time range
 * @returns {Promise<number>}
 */
export const getErrorRate = async (contractId: string, timeRange: string): Promise<number> => {
  const result = await prisma.errorRate.findMany({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    },
    select: {
      errorCount: true
    }
  });
  const totalErrors = result.reduce((acc, curr) => acc + curr.errorCount, 0);
  const totalTransactions = await prisma.transactionVolume.count({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    }
  });
  return (totalErrors / totalTransactions) * 100;
};

/**
 * Record gas usage
 * @param {string} contractId - The contract ID
 * @param {number} gasUsed - The gas used
 * @returns {Promise<void>}
 */
export const recordGasUsage = async (contractId: string, gasUsed: number): Promise<void> => {
  await prisma.gasUsage.create({
    data: {
      contractId,
      gasUsed
    }
  });
};

/**
 * Get gas usage
 * @param {string} contractId - The contract ID
 * @param {string} timeRange - The time range
 * @returns {Promise<{ totalGas: number, averageGas: number }>}
 */
export const getGasUsage = async (
  contractId: string,
  timeRange: string
): Promise<{ totalGas: number; averageGas: number }> => {
  const result = await prisma.gasUsage.findMany({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    },
    select: {
      gasUsed: true
    }
  });
  const totalGas = result.reduce((acc, curr) => acc + curr.gasUsed, 0);
  const averageGas = totalGas / result.length;
  return { totalGas, averageGas };
};

/**
 * Record unique user interaction
 * @param {string} contractId - The contract ID
 * @param {string} userAddress - The user address
 * @returns {Promise<void>}
 */
export const recordUserInteraction = async (
  contractId: string,
  userAddress: string
): Promise<void> => {
  await prisma.uniqueUsers.create({
    data: {
      contractId,
      userAddress
    }
  });
};

/**
 * Get unique users
 * @param {string} contractId - The contract ID
 * @param {string} timeRange - The time range
 * @returns {Promise<number>}
 */
export const getUniqueUsers = async (contractId: string, timeRange: string): Promise<number> => {
  const result = await prisma.uniqueUsers.findMany({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    },
    select: {
      userAddress: true
    }
  });
  const uniqueUsers = new Set(result.map((entry) => entry.userAddress));
  return uniqueUsers.size;
};

/**
 * Record response time
 * @param {string} contractId - The contract ID
 * @param {number} responseTime - The response time
 * @returns {Promise<void>}
 */
export const recordResponseTime = async (
  contractId: string,
  responseTime: number
): Promise<void> => {
  await prisma.responseTime.create({
    data: {
      contractId,
      responseTime
    }
  });
};

/**
 * Get response time
 * @param {string} contractId - The contract ID
 * @param {string} timeRange - The time range
 * @returns {Promise<{ averageResponseTime: number, totalResponseTime: number }>}
 */
export const getResponseTime = async (
  contractId: string,
  timeRange: string
): Promise<{ averageResponseTime: number; totalResponseTime: number }> => {
  const result = await prisma.responseTime.findMany({
    where: {
      contractId,
      timestamp: {
        gte: new Date(Date.now() - parseTimeRange(timeRange))
      }
    },
    select: {
      responseTime: true
    }
  });
  const totalResponseTime = result.reduce((acc, curr) => acc + curr.responseTime, 0);
  const averageResponseTime = totalResponseTime / result.length;
  return { averageResponseTime, totalResponseTime };
};

/**
 * Parse time range
 * @param {string} timeRange - The time range
 * @returns {number}
 */
const parseTimeRange = (timeRange: string): number => {
  const [amount, unit] = timeRange.split(' ');
  const units: { [key: string]: number } = {
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
  };
  return parseInt(amount) * units[unit];
};

export default {
  recordTransaction,
  getTransactionVolume,
  recordError,
  getErrorRate,
  recordGasUsage,
  getGasUsage,
  recordUserInteraction,
  getUniqueUsers,
  recordResponseTime,
  getResponseTime
};
