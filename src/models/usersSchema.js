const Joi = require("joi");

const userRegistartionValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).max(12).required(),
  email: Joi.string().email().required(),
  subscription: Joi.any().valid("starter", "pro", "business").optional(),
  avatarURL: Joi.string().optional(),
});

const userAuthorizationValidationSchema = Joi.object({
  password: Joi.string().min(8).max(12).required(),
  email: Joi.string().email().required(),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.any().valid("starter", "pro", "business").required(),
});

const userVerificationEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "missing required field email" }),
});

module.exports = {
  userRegistartionValidationSchema,
  userAuthorizationValidationSchema,
  userSubscriptionSchema,
  userVerificationEmailSchema,
};
