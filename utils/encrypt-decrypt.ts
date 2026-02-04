import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedData: string) {
  const parts = encryptedData.split('%');
  console.log('secretKey',secretKey)
  console.log(parts);
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  const [ivHex, authTagHex, encrypted] = parts;
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
