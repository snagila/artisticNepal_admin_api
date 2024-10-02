import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { getOrder } from "../model/orderModel.js";

export const orderRouter = express.Router();

// get all orders
orderRouter.get("/", adminAuth, async (req, res) => {
  try {
    const getAllOrder = await getOrder();
    if (getAllOrder) {
      return buildSuccessResponse(res, getAllOrder, "");
    }
  } catch (error) {
    console.log(error.message);
    return buildErrorResponse(res, error.message);
  }
});
