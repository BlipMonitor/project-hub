import Joi from 'joi';

const enqueueMessage = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    priority: Joi.number().integer().min(0).max(10).default(0)
  })
};

export default {
  enqueueMessage
};
