import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";

export default class SampleController {
  static async getMe({ state, response }) {
    const username = state.username;
    const user = (await kv.get(KeyFactory.userKey(username))).value;
    const pick = ({ username, role }) => ({ username, role });
    response.body = pick(user);
  }
}
