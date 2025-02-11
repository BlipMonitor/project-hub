import httpStatus from 'http-status';

import { metricsService } from '../services';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

const getTransactionVolume = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const volume = await metricsService.getTransactionVolume(
    contractId as string,
    timeRange as string
  );
  res.send({ volume });
});

const getErrorRate = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const errorRate = await metricsService.getErrorRate(contractId as string, timeRange as string);
  res.send({ errorRate });
});

const getErrorDetails = catchAsync(async (req, res) => {
  const { contractId, errorType } = req.query;
  if (!contractId || !errorType) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and error type are required');
  }
  const errorDetails = await metricsService.getErrorDetails(
    contractId as string,
    errorType as string
  );
  res.send(errorDetails);
});

const getGasUsage = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const gasUsage = await metricsService.getGasUsage(contractId as string, timeRange as string);
  res.send(gasUsage);
});

const getAverageGasUsage = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const averageGasUsage = await metricsService.getAverageGasUsage(
    contractId as string,
    timeRange as string
  );
  res.send(averageGasUsage);
});

const getUniqueUsers = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const uniqueUsers = await metricsService.getUniqueUsers(
    contractId as string,
    timeRange as string
  );
  res.send({ uniqueUsers });
});

const getUserGrowth = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const userGrowth = await metricsService.getUserGrowth(contractId as string, timeRange as string);
  res.send(userGrowth);
});

const getResponseTime = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const responseTime = await metricsService.getResponseTime(
    contractId as string,
    timeRange as string
  );
  res.send(responseTime);
});

const getResponseTimeDistribution = catchAsync(async (req, res) => {
  const { contractId, timeRange } = req.query;
  if (!contractId || !timeRange) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and time range are required');
  }
  const responseTimeDistribution = await metricsService.getResponseTimeDistribution(
    contractId as string,
    timeRange as string
  );
  res.send(responseTimeDistribution);
});

const recordTransaction = catchAsync(async (req, res) => {
  const { contractId } = req.body;
  if (!contractId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID is required');
  }
  await metricsService.recordTransaction(contractId);
  res.status(httpStatus.CREATED).send();
});

const recordError = catchAsync(async (req, res) => {
  const { contractId, errorType } = req.body;
  if (!contractId || !errorType) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and error type are required');
  }
  await metricsService.recordError(contractId, errorType);
  res.status(httpStatus.CREATED).send();
});

const recordGasUsage = catchAsync(async (req, res) => {
  const { contractId, gasUsed } = req.body;
  if (!contractId || gasUsed === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and gas used are required');
  }
  await metricsService.recordGasUsage(contractId, gasUsed);
  res.status(httpStatus.CREATED).send();
});

const recordUserInteraction = catchAsync(async (req, res) => {
  const { contractId, userAddress } = req.body;
  if (!contractId || !userAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and user address are required');
  }
  await metricsService.recordUserInteraction(contractId, userAddress);
  res.status(httpStatus.CREATED).send();
});

const recordResponseTime = catchAsync(async (req, res) => {
  const { contractId, responseTime } = req.body;
  if (!contractId || responseTime === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contract ID and response time are required');
  }
  await metricsService.recordResponseTime(contractId, responseTime);
  res.status(httpStatus.CREATED).send();
});

export default {
  getTransactionVolume,
  getErrorRate,
  getErrorDetails,
  getGasUsage,
  getAverageGasUsage,
  getUniqueUsers,
  getUserGrowth,
  getResponseTime,
  getResponseTimeDistribution,
  recordTransaction,
  recordError,
  recordGasUsage,
  recordUserInteraction,
  recordResponseTime
};
