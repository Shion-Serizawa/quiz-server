import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import HashHelper from "/utils/hash_helper.js";
import { Roles } from "/config/roles.js";

export default class UserController {
  static async create({ request, cookies, response }) {
    const json = await request.body.json();
    const { username, password, inviteCode } = json;

    if (
      typeof username !== "string" ||
      username === "" ||
      typeof password !== "string" ||
      password === "" ||
      typeof inviteCode !== "string"
    ) {
      Errors.BAD_REQUEST.apply(response);
      return;
    }

    if (inviteCode !== "foobar") {
      Errors.UNKNOWN_INVITE_CODE.apply(response);
      return;
    }

    const oldUser = (await kv.get(KeyFactory.userKey(username))).value;
    if (oldUser) {
      Errors.INVALID_USERNAM.apply(response);
      return;
    }

    // createUser
    const role = Roles.USER;
    const passwordHash = await HashHelper.hash(password);
    const newUser = { username, passwordHash, role };
    await kv.set(KeyFactory.userKey(username), newUser);

    await cookies.set("username", username);

    response.body = { username };
  }
}
