import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import base64url from 'base64url';
import { CookieSerializeOptions, serialize } from 'cookie';
import * as crypto from 'crypto';
import { Config } from '../config/config.interface';
import CookieDecryptionException from './exceptions/CookieDecryptionException';
import InvalidCookieException from './exceptions/InvalidCookieException';

const VERSION_SIZE = 1;
const GCM_IV_SIZE = 12;
const GCM_TAG_SIZE = 16;
const CURRENT_VERSION = 1;

/**
 * A service that encrypts and decrypts cookies.
 */
@Injectable()
export class CookieEncryptionService {
  public constructor(private readonly configService: ConfigService<Config>) {}

  /**
   * Decrypts a cookie value and returns the decrypted value.
   * @param name the name of the cookie.
   * @param value the encrypted value of the cookie.
   * @param additionalOptions additional options to be used when serializing the cookie.
   * @returns the decrypted value of the cookie.
   */
  public createEncryptedCookie(
    name: string,
    value: string,
    additionalOptions: Partial<CookieSerializeOptions> = {}
  ): string {
    const defaultCookieOptions = this.configService.get('cookieOptions', { infer: true });
    const cookieOptions: CookieSerializeOptions = { ...defaultCookieOptions, ...additionalOptions };
    return serialize(name, this.encrypt(value), cookieOptions);
  }

  /**
   * Encrypts a cookie value and returns the encrypted value.
   * @param plaintext the plaintext value of the cookie.
   * @returns the encrypted value of the cookie.
   */
  public encrypt(plaintext: string): string {
    const encKeyHex = this.configService.get('encKey', { infer: true });
    const ivBytes = crypto.randomBytes(GCM_IV_SIZE);
    const encKeyBytes = Buffer.from(encKeyHex, 'hex');

    const cipher = crypto.createCipheriv('aes-256-gcm', encKeyBytes, ivBytes);

    const encryptedBytes = cipher.update(plaintext);
    const finalBytes = cipher.final();

    const versionBytes = Buffer.from(new Uint8Array([CURRENT_VERSION]));
    const ciphertextBytes = Buffer.concat([encryptedBytes, finalBytes]);
    const tagBytes = cipher.getAuthTag();

    const allBytes = Buffer.concat([versionBytes, ivBytes, ciphertextBytes, tagBytes]);

    return base64url.encode(allBytes);
  }

  /**
   * Decrypts a cookie value and returns the plaintext value.
   * @param encryptedbase64value the encrypted value of the cookie.
   * @returns the decrypted value of the cookie.
   */
  public decrypt(encryptedbase64value: string): string {
    const encKeyHex = this.configService.get('encKey', { infer: true });
    const allBytes = base64url.toBuffer(encryptedbase64value);

    const minSize = VERSION_SIZE + GCM_IV_SIZE + 1 + GCM_TAG_SIZE;
    if (allBytes.length < minSize) {
      const error = new Error('The received cookie has an invalid length');
      throw new InvalidCookieException(error);
    }

    const version = allBytes[0];
    if (version != CURRENT_VERSION) {
      const error = new Error('The received cookie has an invalid format');
      throw new InvalidCookieException(error);
    }

    let offset = VERSION_SIZE;
    const ivBytes = allBytes.subarray(offset, offset + GCM_IV_SIZE);

    offset += GCM_IV_SIZE;
    const ciphertextBytes = allBytes.subarray(offset, allBytes.length - GCM_TAG_SIZE);

    offset = allBytes.length - GCM_TAG_SIZE;
    const tagBytes = allBytes.subarray(offset, allBytes.length);

    try {
      const encKeyBytes = Buffer.from(encKeyHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', encKeyBytes, ivBytes);
      decipher.setAuthTag(tagBytes);

      const decryptedBytes = decipher.update(ciphertextBytes);
      const finalBytes = decipher.final();

      const plaintextBytes = Buffer.concat([decryptedBytes, finalBytes]);
      return plaintextBytes.toString();
    } catch (e: any) {
      throw new CookieDecryptionException(e);
    }
  }
}
