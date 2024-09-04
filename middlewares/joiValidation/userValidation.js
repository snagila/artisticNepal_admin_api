import Joi from "joi";

import { buildErrorResponse } from "../../utility/responseHelper.js";

export const newAdminValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error.message);
      return buildErrorResponse(res, error.message);
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
