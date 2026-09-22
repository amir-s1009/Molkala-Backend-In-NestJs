import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcrypt';
import { Role } from '@prisma/client';

export type JWT = {
  userId: string;
  roles: Role[];
};

export default class AuthDomain {
  private SALT = 12;

  private retreiveJwtSecret(): Uint8Array {
    const key = process.env.ACCESS_TOKEN_KEY;
    if (!key) throw new Error('کلید توکن احراز هویت یافت نشد.');
    const secret = new TextEncoder().encode(key);
    return secret;
  }

  async hashPassword(raw: string): Promise<string> {
    return await hash(raw, this.SALT);
  }

  async validatePassword(raw: string, hashed: string): Promise<boolean> {
    return await compare(raw, hashed);
  }

  async signJwt(payload: JWT): Promise<string> {
    const secret = this.retreiveJwtSecret();

    const token = new SignJWT(payload)
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(secret);

    return token;
  }

  async validateJwt(token: string): Promise<JWT> {
    const secret = this.retreiveJwtSecret();
    const { payload } = await jwtVerify<JWT>(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  }
}
