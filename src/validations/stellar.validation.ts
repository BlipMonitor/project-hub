import Joi from 'joi';

const getAccountDetails = {
  params: Joi.object().keys({
    accountId: Joi.string().required().description('Stellar account ID')
  })
};

const getTransactionDetails = {
  params: Joi.object().keys({
    transactionHash: Joi.string().required().description('Stellar transaction hash')
  })
};

const getSorobanContractData = {
  params: Joi.object().keys({
    contractId: Joi.string().required().description('Soroban contract ID')
  })
};

const invokeContract = {
  body: Joi.object().keys({
    contractId: Joi.string().required(),
    functionName: Joi.string().required(),
    args: Joi.array().items(Joi.any()).required()
  })
};

export default {
  getAccountDetails,
  getTransactionDetails,
  getSorobanContractData,
  invokeContract
};
