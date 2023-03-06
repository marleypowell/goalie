import base64url from 'base64url';
import * as crypto from 'crypto';

export function generateHash(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashedData = hash.digest('base64');

  return base64url.encode(hashedData);
}
