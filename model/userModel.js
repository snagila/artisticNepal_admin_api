import userSchema from "../schema/userSchema.js";

// create user
export const createNewUser = (userFormObj) => {
  return userSchema(userFormObj).save();
};

// find user by email
export const findUserByEmail = (userEmail) => {
  return userSchema.findOne({ email: userEmail });
};

// update user details
export const updateUser = (findByEmail, updatepart) => {
  return userSchema.findOneAndUpdate(
    { email: findByEmail },
    { $set: updatepart },
    { new: true }
  );
};
