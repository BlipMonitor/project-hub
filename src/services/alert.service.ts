import prisma from '../client';
import config from '../config/config';
import {
  getAverageGasUsage,
  getResponseTime,
  getUniqueUsers,
  getUserGrowth
} from './metrics.service';
import emailService from './email.service';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Check for high error rate
 * @param {string} contractAddress - The contract address
 * @param {number} threshold - The error rate threshold
 * @param {number} timeWindow - The time window in minutes
 */
const checkHighErrorRate = async (
  contractAddress: string,
  threshold: number,
  timeWindow: number
) => {
  const errors = await prisma.contractInteraction.count({
    where: {
      contractId: contractAddress,
      status: 'error',
      timestamp: {
        gte: new Date(Date.now() - timeWindow * 60000)
      }
    }
  });
  const totalTransactions = await prisma.contractInteraction.count({
    where: {
      contractId: contractAddress,
      timestamp: {
        gte: new Date(Date.now() - timeWindow * 60000)
      }
    }
  });
  const errorRate = (errors / totalTransactions) * 100;

  if (errorRate > threshold) {
    const alert = await prisma.alert.create({
      data: {
        contractAddress,
        alertType: 'High Error Rate',
        status: 'active',
        details: { errorRate }
      }
    });
    await createNotification(alert.id, 'High Error Rate Alert');
  }
};

/**
 * Check for unusual transaction volume spike
 * @param {string} contractAddress - The contract address
 * @param {number} threshold - The volume spike threshold
 * @param {number} timeWindow - The time window in minutes
 */
const checkUnusualTransactionVolumeSpike = async (
  contractAddress: string,
  threshold: number,
  timeWindow: number
) => {
  const currentVolume = await prisma.contractInteraction.count({
    where: {
      contractId: contractAddress,
      timestamp: {
        gte: new Date(Date.now() - timeWindow * 60000)
      }
    }
  });
  const averageVolume = await prisma.dailyTransactionVolume.aggregate({
    _avg: {
      transactionCount: true
    },
    where: {
      contractId: contractAddress,
      date: {
        gte: new Date(Date.now() - timeWindow * 60000)
      }
    }
  });
  const avgTotalInteractions = averageVolume._avg.transactionCount ?? 0;
  const volumeSpike = ((currentVolume - avgTotalInteractions) / avgTotalInteractions) * 100;

  if (volumeSpike > threshold) {
    const alert = await prisma.alert.create({
      data: {
        contractAddress,
        alertType: 'Unusual Transaction Volume Spike',
        status: 'active',
        details: { volumeSpike }
      }
    });
    await createNotification(alert.id, 'Unusual Transaction Volume Spike Alert');
  }
};

/**
 * Check for high gas usage
 * @param {string} contractAddress - The contract address
 * @param {number} threshold - The gas usage threshold
 * @param {number} timeWindow - The time window in minutes
 */
const checkHighGasUsage = async (
  contractAddress: string,
  threshold: number,
  timeWindow: number
) => {
  const averageGasUsage = await getAverageGasUsage(contractAddress, `${timeWindow} minutes`);

  if (averageGasUsage > threshold) {
    const alert = await prisma.alert.create({
      data: {
        contractAddress,
        alertType: 'High Gas Usage',
        status: 'active',
        details: { averageGasUsage }
      }
    });
    await createNotification(alert.id, 'High Gas Usage Alert');
  }
};

/**
 * Check for slow response time
 * @param {string} contractAddress - The contract address
 * @param {number} threshold - The response time threshold
 * @param {number} timeWindow - The time window in minutes
 */
const checkSlowResponseTime = async (
  contractAddress: string,
  threshold: number,
  timeWindow: number
) => {
  const responseTimeData = await getResponseTime(contractAddress, `${timeWindow} minutes`);
  const averageResponseTime = responseTimeData.averageResponseTime;

  if (averageResponseTime > threshold) {
    const alert = await prisma.alert.create({
      data: {
        contractAddress,
        alertType: 'Slow Response Time',
        status: 'active',
        details: { averageResponseTime }
      }
    });
    await createNotification(alert.id, 'Slow Response Time Alert');
  }
};

/**
 * Check for unusual user activity
 * @param {string} contractAddress - The contract address
 * @param {number} threshold - The user activity threshold
 * @param {number} timeWindow - The time window in minutes
 */
const checkUnusualUserActivity = async (
  contractAddress: string,
  threshold: number,
  timeWindow: number
) => {
  const currentUserCount = Number(await getUniqueUsers(contractAddress, `${timeWindow} minutes`));
  const averageUserCount = Number(await getUserGrowth(contractAddress, `${timeWindow} minutes`));
  const userActivitySpike =
    ((currentUserCount - (averageUserCount ?? 0)) / (averageUserCount ?? 1)) * 100;

  if (userActivitySpike > threshold) {
    const alert = await prisma.alert.create({
      data: {
        contractAddress,
        alertType: 'Unusual User Activity',
        status: 'active',
        details: { userActivitySpike }
      }
    });
    await createNotification(alert.id, 'Unusual User Activity Alert');
  }
};

/**
 * Create a notification for an alert
 * @param {number} alertId - The alert ID
 * @param {string} notificationType - The type of notification
 * @param {string} recipient - The recipient of the notification
 */
const createNotification = async (
  alertId: number,
  notificationType: string,
  recipient: string = config.email.exampleEmail
) => {
  await prisma.notification.create({
    data: {
      alertId,
      notificationType,
      recipient,
      status: 'sent'
    }
  });

  // Send email notification
  const subject = `${notificationType}`;
  const text = `An alert has been triggered: ${notificationType}. Please check the system for more details.`;
  await emailService.sendAlertEmail(recipient, subject, text);
};

/**
 * Process alerts for all contracts
 * @param {string} contractAddress - The contract address
 */
const processAlerts = async (contractAddress?: string) => {
  if (contractAddress) {
    await processAlertsForContract(contractAddress);
  } else {
    const contracts = await prisma.contractInvocation.findMany();
    for (const contract of contracts) {
      await processAlertsForContract(contract.contractId);
    }
  }
};

/**
 * Process alerts for a specific contract
 * @param {string} contractAddress - The contract address
 */
const processAlertsForContract = async (contractAddress: string) => {
  const alertConfigs = await prisma.alertConfiguration.findMany({
    where: { contractAddress, enabled: true }
  });

  for (const config of alertConfigs) {
    switch (config.alertType) {
      case 'High Error Rate':
        await checkHighErrorRate(contractAddress, config.threshold, config.timeWindow);
        break;
      case 'Unusual Transaction Volume Spike':
        await checkUnusualTransactionVolumeSpike(
          contractAddress,
          config.threshold,
          config.timeWindow
        );
        break;
      case 'High Gas Usage':
        await checkHighGasUsage(contractAddress, config.threshold, config.timeWindow);
        break;
      case 'Slow Response Time':
        await checkSlowResponseTime(contractAddress, config.threshold, config.timeWindow);
        break;
      case 'Unusual User Activity':
        await checkUnusualUserActivity(contractAddress, config.threshold, config.timeWindow);
        break;
    }
  }
};

export default {
  checkHighErrorRate,
  checkUnusualTransactionVolumeSpike,
  checkHighGasUsage,
  checkSlowResponseTime,
  checkUnusualUserActivity,
  processAlerts,
  processAlertsForContract
};
