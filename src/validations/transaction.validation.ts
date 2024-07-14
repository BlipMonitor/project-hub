import Joi from 'joi';

const getAllTransactions = {
  query: Joi.object().keys({})
};

const getTransactionDetails = {
  params: Joi.object().keys({
    transactionHash: Joi.string().required().description('Stellar transaction hash')
  })
};

export default {
  getAllTransactions,
  getTransactionDetails
};
