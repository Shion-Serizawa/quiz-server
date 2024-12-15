import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import HashHelper from "/utils/hash_helper.js";

export default class AuthController {
  static async signin({ request, cookies, response }) {
    const json = await request.body.json();
    const { username, password } = json;

    if (
      typeof username !== "string" ||
      username === "" ||
      typeof password !== "string" ||
      password === ""
    ) {
      Errors.BAD_REQUEST.apply(response);
      return;
    }

    const user = (await kv.get(KeyFactory.userKey(username))).value;
    if (!user) {
      Errors.WRONG_USERNAME_OR_PASSWORD.apply(response);
      return;
    }

    const isCorrectPassword = await HashHelper.compare(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      Errors.WRONG_USERNAME_OR_PASSWORD.apply(response);
      return;
    }

    await cookies.set("username", username);

    response.body = { username };
  }

  static async signout({ cookies, response }) {
    await cookies.set("username", "", { maxAge: 0 });
    response.status = 200;
  }
}
