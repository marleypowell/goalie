import * as crypto from 'crypto';

const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(length = 64): string {
  const arr = new Uint8Array(length);
  crypto.randomFillSync(arr);
  const mappedArray = arr.map((x) => VALID_CHARS.charCodeAt(x % VALID_CHARS.length));
  return String.fromCharCode.apply(null, [...mappedArray]);
}
