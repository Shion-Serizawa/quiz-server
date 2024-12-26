import * as Errors from "/utils/errors.js";
import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";

export default class AnswerController {
  static async post({ params, state, response, request }) {
    const username = state.username;
    const questionId = await params.questionId;
    const json = await request.body.json();
    const answerChoiceId = json.choiceId;

    if (typeof username !== "string" || username === "") {
      response.body = Errors.NOT_LOGIN;
      return;
    }
    if (
      typeof questionId !== "string" ||
      questionId === "" ||
      typeof answerChoiceId !== "number" ||
      answerChoiceId === ""
    ) {
      response.body = Errors.BAD_REQUEST;
      return;
    }

    const correctAnswer = await kv.get(KeyFactory.questionKey(questionId));
    const correctAnswerId = correctAnswer.value.correctChoiceId;
    const status = await kv.get(KeyFactory.statusKey());
    const answerDuration = Date.now() - status.value.openTimestamp;

    const isCorrect = answerChoiceId === correctAnswerId;

    const value = {
      username: username,
      questionId: questionId,
      answerChoiceId: answerChoiceId,
      isCorrect: isCorrect,
      answerDuration: answerDuration,
    };

    await kv.set(KeyFactory.answerKey(username, questionId), value);

    response.status = 200;
  }

  static async get({ params, state, response }) {
    const username = state.username;
    const questionId = await params.questionId;

    const answer = await kv.get(KeyFactory.answerKey(username, questionId));
    if (answer.value === null) {
      response.body = Errors.NOT_ANSWER;
      return;
    }

    response.body = { "choiseId": answer.value.answerChoiceId };
  }

  static async getCount({ params, response }) {
    const questionId = await params.questionId;
    const prefix = [KeyFactory.answerKey().at(0)];
    const iter = kv.list({ prefix });

    const answerCounts = new Map();

    for await (const { key, value } of iter) {
      if (key.length === 3 && key[2] === questionId) {
        const { answerChoiceId } = value;
        if (answerCounts.has(answerChoiceId)) {
          answerCounts.set(
            answerChoiceId,
            answerCounts.get(answerChoiceId) + 1,
          );
        } else {
          answerCounts.set(answerChoiceId, 1);
        }
      }
    }

    response.body = {
      answers: Array.from(answerCounts.entries()).map(([choiceId, count]) => ({
        choiceId,
        count,
      })),
    };
  }

  static async deleteAllAnswer({ response }) {
    const kv = await Deno.openKv();
    const prefix = [KeyFactory.answerKey().at(0)];
    const iter = kv.list({ prefix });

    for await (const { key } of iter) {
      await kv.delete(key);
    }

    response.status = 200;
  }
}
