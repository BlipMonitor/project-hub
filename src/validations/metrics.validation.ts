import Joi from 'joi';

const getTransactionVolume = {
  query: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    timeRange: Joi.string().required().description('Time range')
  })
};

const getErrorRate = {
  query: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    timeRange: Joi.string().required().description('Time range')
  })
};

const getGasUsage = {
  query: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    timeRange: Joi.string().required().description('Time range')
  })
};

const getUniqueUsers = {
  query: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    timeRange: Joi.string().required().description('Time range')
  })
};

const getResponseTime = {
  query: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    timeRange: Joi.string().required().description('Time range')
  })
};

const recordTransaction = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID')
  })
};

const recordError = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    errorType: Joi.string().required().description('Error type')
  })
};

const recordGasUsage = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    gasUsed: Joi.number().required().description('Gas used')
  })
};

const recordUserInteraction = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    userAddress: Joi.string().required().description('User address')
  })
};

const recordResponseTime = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID'),
    responseTime: Joi.number().required().description('Response time')
  })
};

export default {
  getTransactionVolume,
  getErrorRate,
  getGasUsage,
  getUniqueUsers,
  getResponseTime,
  recordTransaction,
  recordError,
  recordGasUsage,
  recordUserInteraction,
  recordResponseTime
};
