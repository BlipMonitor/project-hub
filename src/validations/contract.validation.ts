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

const processContractEvents = {
  body: Joi.array()
    .items(
      Joi.object().keys({
        eventId: Joi.string().required().description('Event ID'),
        contractId: Joi.string().required().description('Soroban contract ID'),
        eventType: Joi.string().required().description('Event type'),
        eventData: Joi.any().required().description('Event data')
      })
    )
    .required()
};

export default {
  getContractData,
  invokeContract,
  processContractEvents
};
