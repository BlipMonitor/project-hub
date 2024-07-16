import Joi from 'joi';

const processAlerts = {
  body: Joi.object().keys({
    contractId: Joi.string().required().description('Contract ID')
  })
};

export default {
  processAlerts
};
