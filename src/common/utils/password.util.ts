import * as bcrypt from 'bcrypt';

export function compareHash(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
