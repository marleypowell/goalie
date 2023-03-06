import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import base64url from 'base64url';
import { CookieSerializeOptions, serialize } from 'cookie';
import * as crypto from 'crypto';
import CookieDecryptionException from './exceptions/CookieDecryptionException';
import InvalidCookieException from './exceptions/InvalidCookieException';

const VERSION_SIZE = 1;
const GCM_IV_SIZE = 12;
const GCM_TAG_SIZE = 16;
const CURRENT_VERSION = 1;

@Injectable()
export class CookieEncryptionService {
  public constructor(private readonly configService: ConfigService) {}

  public getEncryptedCookie(
    name: string,
    value: string,
    additionalOptions: Partial<CookieSerializeOptions> = {}
  ): string {
    const defaultCookieOptions = this.configService.get<CookieSerializeOptions>('cookieOptions');
    const cookieOptions = { ...defaultCookieOptions, ...additionalOptions };
    return serialize(name, this.encrypt(value), cookieOptions);
  }

  public encrypt(plaintext: string): string {
    const encKeyHex = this.configService.get<string>('encKey');
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

  public decrypt(encryptedbase64value: string): string {
    const encKeyHex = this.configService.get<string>('encKey');
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
