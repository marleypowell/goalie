import * as crypto from 'crypto';

/**
 * Generates a hash from the given data using the SHA256 algorithm.
 * @param data the data to hash
 * @returns the hashed data
 */
export function generateHash(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashedData = hash.digest('base64');

  return base64UrlEncode(hashedData);
}

/**
 * Encodes the given data to base64url.
 * @param hashedData the data to encode
 * @returns the encoded data
 */
function base64UrlEncode(hashedData: string): string {
  return hashedData.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
