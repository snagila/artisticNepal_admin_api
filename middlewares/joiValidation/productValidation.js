import Joi from "joi";
import { buildErrorResponse } from "../../utility/responseHelper.js";

export const newProductValidation = (req, res, next) => {
  console.log(req.body);
  try {
    const schema = Joi.object({
      category: Joi.string().min(1).required(),
      name: Joi.string().min(1).required(),
      price: Joi.number().min(1).required(),
      quantity: Joi.number().min(1).required(),
      sku: Joi.string().min(1).required(),
      description: Joi.string().min(1).required(),
      status: Joi.string().optional().allow(""),
      salesPrice: Joi.number().optional().allow(),
      salesStartDate: Joi.date().optional().allow(),
      salesEndDate: Joi.date().optional().allow(),
      images: Joi.any(),
      thumbnail: Joi.any(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log("Joierror", error.message);
      return buildErrorResponse(res, error.message);
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};
