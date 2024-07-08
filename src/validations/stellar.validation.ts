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

export default {
  getAccountDetails,
  getTransactionDetails
};
