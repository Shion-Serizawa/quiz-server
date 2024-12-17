import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import HashHelper from "/utils/hash_helper.js";
import { INVITE_CODE_ROLES } from "/config/roles.js";

export default class UserController {
  static async create({ request, response }) {
    const json = await request.body.json();
    const { username, password, inviteCode } = json;

    if (
      typeof username !== "string" ||
      username === "" ||
      typeof password !== "string" ||
      password === "" ||
      typeof inviteCode !== "string"
    ) {
      response.body = Errors.BAD_REQUEST;
      return;
    }

    const role = INVITE_CODE_ROLES.get(inviteCode);

    if (!role) {
      response.body = Errors.UNKNOWN_INVITE_CODE;
      return;
    }

    // すでに存在するユーザ名のチェック
    const oldUser = (await kv.get(KeyFactory.userKey(username))).value;
    if (oldUser) {
      response.body = Errors.INVALID_USERNAME;
      return;
    }

    // createUser
    const passwordHash = await HashHelper.hash(password);
    const newUser = { username, passwordHash, role };
    await kv.set(KeyFactory.userKey(username), newUser);

    response.body = { accessToken: username };
  }
}
