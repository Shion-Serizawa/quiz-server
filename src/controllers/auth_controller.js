import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import HashHelper from "/utils/hash_helper.js";
import JWTHelper from "/utils/jwt_helper.js";

export default class AuthController {
  static async signin({ request, response }) {
    const json = await request.body.json();
    const { username, password } = json;

    if (
      typeof username !== "string" ||
      username === "" ||
      typeof password !== "string" ||
      password === ""
    ) {
      response.body = Errors.BAD_REQUEST;
      return;
    }

    const user = (await kv.get(KeyFactory.userKey(username))).value;
    if (!user) {
      response.body = Errors.WRONG_USERNAME_OR_PASSWORD;
      return;
    }

    const isCorrectPassword = await HashHelper.compare(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      response.body = Errors.WRONG_USERNAME_OR_PASSWORD;
      return;
    }

    const accessToken = await JWTHelper.createJWT({ username });

    response.body = { username, accessToken, role: user.role };
  }

  static signout({ response }) {
    response.status = 200;
  }
}
