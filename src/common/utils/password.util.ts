import * as bcrypt from 'bcrypt';

export function compareHash(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function hashPassword(plaintext) {
  return bcrypt.hashSync(plaintext, 5);
}
