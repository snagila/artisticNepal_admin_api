import sessionSchema from "../schema/sessionSchema.js";

// create session
export const createSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};

// delete all accesstoken session
export const deletePreviousAccessTokens = (userEmail) => {
  return sessionSchema.deleteMany({ email: userEmail });
};
// find session by email
export const findUserByToken = (userToken) => {
  return sessionSchema.findOne({ token: userToken });
};
