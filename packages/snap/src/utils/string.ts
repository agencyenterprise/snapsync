/**
 * Convert a string to a hexadecimal string.
 *
 * @param value - The string to convert.
 * @returns The hexadecimal string.
 */
export function stringToHex(value: string): string {
  return Buffer.from(value).toString('hex');
}
