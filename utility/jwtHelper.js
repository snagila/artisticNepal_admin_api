import jwt from "jsonwebtoken";
import { createSession } from "../model/sessionModel.js";
import { updateUser } from "../model/userModel.js";

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// access jwt: session table, exp:15min
export const generateAccessJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30d",
  });
  await createSession({ email, token });

  return token;
};

// refreshtoken JWT: admin table, exp:30days
export const generateRefreshJWT = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  await updateUser(email, { refreshJWT: token });
  return token;
};

// generate token
export const generateJWTs = async (email) => {
  return {
    accessJWT: await generateAccessJWT(email),
    refreshJWT: await generateRefreshJWT(email),
  };
};

// verify accessJWT
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
};

// verify refreshJWT
export const verifyRefreshJWT = (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);
};
