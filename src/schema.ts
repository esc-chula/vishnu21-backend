import * as Joi from 'joi';

export const environmentValidator = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().default('foobarbar'),
  JWT_TIME: Joi.string().default('7d'),
  DEEPAPP_ID: Joi.string().required(),
  DEEPAPP_SECRET: Joi.string().required(),
  LINE_CHANNEL_ACCESS_TOKEN: Joi.string().required(),
});
