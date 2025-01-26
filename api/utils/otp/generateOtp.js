import crypto from "crypto";

/**
 * Generates a random OTP (One-Time Password) of the specified length.
 *
 * @param {number} [length=4] - The length of the OTP to generate. Defaults to 4 if not specified.
 * @returns {string} - A string representing the generated OTP.
 */
const generateOtp = (length = 4) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;
  return crypto.randomInt(min, max).toString();
};

export default generateOtp;
