import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";

export default class StatusController {
  static async post({ request, response }) {
    const json = await request.body.json();
    const status = json.status;

    if (typeof status !== "string" || status === "") {
      response.body = Errors.BAD_REQUEST;
      return;
    }
    if (status === "open" || status === "closed") {
      const questionId = json.questionId;
      if (typeof questionId !== "number" || status === "") {
        response.body = Errors.BAD_REQUEST;
        return;
      }
    }

    await kv.set(KeyFactory.statusKey(), json);
    response.status = 200;
  }
}
