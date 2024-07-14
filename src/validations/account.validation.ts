import Joi from 'joi';

const getAllAccounts = {
  query: Joi.object().keys({})
};

const getAccountDetails = {
  params: Joi.object().keys({
    accountId: Joi.string().required().description('Stellar account ID')
  })
};

export default {
  getAllAccounts,
  getAccountDetails
};
