import Joi from "joi";
import { buildErrorResponse } from "../../utility/responseHelper.js";

export const newProductValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      category: Joi.string().min(1).required(),
      name: Joi.string().min(1).required(),
      price: Joi.number().min(1).required(),
      quantity: Joi.string().min(1).required(),
      sku: Joi.string().min(1).required(),
      description: Joi.string().min(1).required(),
      status: Joi.string(),
      salesPrice: Joi.number(),
      salesStartDate: Joi.date(),
      salesEndDate: Joi.date(),
      images: Joi.any(),
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
