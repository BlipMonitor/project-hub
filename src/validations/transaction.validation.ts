import Joi from 'joi';

const getTransactionDetails = {
  params: Joi.object().keys({
    transactionHash: Joi.string().required().description('Stellar transaction hash')
  })
};

export default {
  getTransactionDetails
};
