import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcrypt";
import { Role } from "@prisma/client";

export type JWT = {
  userId: string;
  roles: Role[];
};

export default class AuthDomain {
  private static SALT = 12;

  private static retreiveJwtSecret(): Uint8Array {
    const key = process.env.ACCESS_TOKEN_KEY;
    if (!key) throw new Error("کلید توکن احراز هویت یافت نشد.");
    const secret = new TextEncoder().encode(key);
    return secret;
  }

  static async hashPassword(raw: string): Promise<string> {
    return await hash(raw, this.SALT);
  }

  static async validatePassword(raw: string, hashed: string): Promise<boolean> {
    return await compare(raw, hashed);
  }

  static async signJwt(payload: JWT): Promise<string> {
    const secret = this.retreiveJwtSecret();

    const token = new SignJWT(payload)
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(secret);

    return token;
  }

  static async validateJwt(token: string): Promise<JWT> {
    const secret = this.retreiveJwtSecret();
    const { payload } = await jwtVerify<JWT>(token, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  }
}
