import Joi from 'joi';

const getLatestLedger = {
  query: Joi.object().keys({})
};

export default {
  getLatestLedger
};
