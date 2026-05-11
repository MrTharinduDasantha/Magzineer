// Password hashing and comparison helpers
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Hash a plaintext password before storing it in the DB
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// Compare a candidate plaintext password against a stored hash
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
