import * as Joi from 'joi';

export const environmentValidator = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().default('foobarbar'),
  JWT_TIME: Joi.string().default('7d'),
  DEEAPP_ID: Joi.string().required(),
  DEEAPP_SECRET: Joi.string().required(),
});
