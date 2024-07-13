import Joi from 'joi';

const getContractData = {
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
  getContractData,
  invokeContract
};
