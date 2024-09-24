import { ARRAY_BIT_LENGTH } from 'src/shared/constants';

export function getBitsArray(a: number, n: number): string {
  return '0'.repeat(a) + '1'.repeat(n) + '0'.repeat(ARRAY_BIT_LENGTH - a - n);
}
