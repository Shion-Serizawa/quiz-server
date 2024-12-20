import { jwtVerify, SignJWT } from "jose/index.ts";

// see: https://docs.deno.com/examples/creating_and_verifying_jwt/

const secret = new TextEncoder().encode(Deno.env.get("ACCESS_TOKEN_SECRET"));

export default class JWTHelper {
  static async createJWT(payload) {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10h")
      .sign(secret);
    return jwt;
  }

  static async verifyJWT(token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (_e) {
      return null;
    }
  }
}
