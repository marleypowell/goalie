import { Pipe, PipeTransform } from '@angular/core';

interface User {
  name: {
    givenName: string;
    familyName: string;
  };
}

/**
 * Hashes a string.
 * @param str the string to hash.
 * @returns the hash.
 */
function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

/**
 * Normalizes a hash to a range.
 * @param hash the hash to normalize.
 * @param min the minimum value.
 * @param max the maximum value.
 * @returns the normalized hash.
 */
function normalizeHash(hash: number, min: number, max: number): number {
  const range = max - min;
  return Math.floor((hash % range) + min);
}

/**
 * Converts a string to an HSL color.
 * @param str the string to convert to a color.
 * @returns the color.
 */
function stringToHslColor(str: string): string {
  const hash = hashString(str);
  const hue = normalizeHash(hash, 0, 360);
  const saturation = normalizeHash(hash, 0, 100);
  const lightness = normalizeHash(hash, 0, 100);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

@Pipe({
  name: 'userAvatar',
  standalone: true,
})
export class UserAvatarPipe implements PipeTransform {
  public transform(value: User | undefined): { initials: string; color: string } | null {
    if (!value) {
      return null;
    }

    const initials = (
      (value.name.givenName?.substring(0, 1) ?? '') + (value.name.familyName?.substring(0, 1) ?? '')
    ).toUpperCase();
    const color = stringToHslColor(initials);
    return { initials, color };
  }
}
