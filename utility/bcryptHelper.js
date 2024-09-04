import bcrypt from "bcrypt";

const SALT = 10;
export const hashPassword = (plain_password) => {
  const hashedPassword = bcrypt.hashSync(plain_password, SALT);
  return hashedPassword;
};

export const comparePassword = (plain_password, encryptedPassword) => {
  return bcrypt.compareSync(plain_password, encryptedPassword);
};
