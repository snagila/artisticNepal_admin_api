import { findUserByEmail } from "../model/userModel.js";
import { verifyAccessJWT } from "../utility/jwtHelper.js";
import { buildErrorResponse } from "../utility/responseHelper.js";

export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decodedAccessJWT = verifyAccessJWT(authorization);
    if (!decodedAccessJWT) {
      throw new Error("Invalid token,UnAuthorized.");
    }
    if (decodedAccessJWT) {
      const admin = await findUserByEmail(decodedAccessJWT.email);

      if (admin.isVerified && admin.role === "admin") {
        (admin.password = undefined), (req.adminInfo = admin);
        return next();
      }
    }
  } catch (error) {
    buildErrorResponse(res, error.message || "Invalid token,UnAuthorized.");
  }
};
