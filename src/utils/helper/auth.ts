import bcrypt from "bcrypt";
import logger from "../logger";

/**
 * Hash a plain password using bcrypt
 * @param password - The raw password to hash
 * @returns Promise<string>
 */
export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        logger.error(`Salt Error: ${err}`);
        return reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          logger.error(`Hash Error: ${err}`);
          return reject(err);
        }

        resolve(hash);
      });
    });
  });
};

/**
 * Compare a raw password with a hashed one
 * @param password - Raw input password
 * @param hashed - Previously hashed password
 * @returns Promise<boolean>
 */
export const comparePassword = (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
