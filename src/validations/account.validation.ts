import Joi from 'joi';

const getAccountDetails = {
  params: Joi.object().keys({
    accountId: Joi.string().required().description('Stellar account ID')
  })
};

export default {
  getAccountDetails
};
