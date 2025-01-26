import bcrypt from "bcryptjs";

/**
 * Hashes a given value using bcrypt with a salt generated from the environment variable SALT_NUMBER.
 *
 * @param {string} value - The value to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed value.
 */
const hashValue = async (value) => {
  const saltNumber = parseInt(process.env.SALT_NUMBER);
  const salt = await bcrypt.genSalt(saltNumber);
  return await bcrypt.hash(value, salt);
};

/**
 * Compares a given value with a hashed value to check if they match.
 *
 * @param {string} value - The plain text value to compare.
 * @param {string} hashValue - The hashed value to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the values match, otherwise false.
 */
const compareHash = async (value, hashValue) => {
  return await bcrypt.compare(value, hashValue);
};

export { hashValue, compareHash };
