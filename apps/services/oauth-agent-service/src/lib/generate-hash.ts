import * as crypto from 'crypto';

export function generateHash(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashedData = hash.digest('base64');

  return base64UrlEncode(hashedData);
}

function base64UrlEncode(hashedData: string): string {
  return hashedData.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
