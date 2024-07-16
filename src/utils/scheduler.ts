import cron from 'node-cron';

import logger from '../config/logger';
import { alertService } from '../services';
import dailyAggregationService from '../services/dailyAggregation.service';

// Schedule tasks to run at midnight every day
export const startScheduler = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Starting daily aggregation tasks');

      await dailyAggregationService.aggregateDailyTransactionVolume();
      await dailyAggregationService.aggregateDailyErrorRate();
      await dailyAggregationService.aggregateDailyGasUsage();
      await dailyAggregationService.aggregateDailyUniqueUsers();
      await dailyAggregationService.aggregateDailyResponseTime();

      logger.info('Daily aggregation tasks completed successfully');
    } catch (error) {
      logger.error('Error running daily aggregation tasks', error);
    }
  });

  // Schedule alert condition checks to run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('Starting alert condition checks');
      await alertService.processAlerts();
      logger.info('Alert condition checks completed successfully');
    } catch (error) {
      logger.error('Error running alert condition checks', error);
    }
  });
};
