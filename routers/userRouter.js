import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  deleteUserDetails,
  getAllUsers,
  updateUser,
} from "../model/userModel.js";

export const userRouter = express.Router();

// get user
userRouter.get("/", adminAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users) {
      buildSuccessResponse(res, users, "");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// edit user
userRouter.post("/:id", adminAuth, async (req, res) => {
  try {
    const formData = req.body;
    const updatedUser = await updateUser(formData.email, formData);

    if (updatedUser) {
      buildSuccessResponse(res, updatedUser, "Update Successful.");
    }
  } catch (error) {
    console.log(error);
    buildErrorResponse(res, error.message);
  }
});

// delete user
userRouter.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleteUser = await deleteUserDetails(id);
    console.log(deleteUser);
    if (deleteUser.deletedCount > 0) {
      return buildSuccessResponse(res, "", "User successfully deleted.");
    }
  } catch (error) {
    console.log(error);
    buildErrorResponse(res, error.message);
  }
});
