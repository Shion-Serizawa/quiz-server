import { kv } from "../db/kv.js";
import * as Errors from "/utils/errors.js";
import KeyFactory from "/db/key_factory.js";

export default class QuestionController {
  // 質問を投稿するメソッド
  static async postQuestion(ctx) {
    // リクエストボディの取得
    const body = await ctx.request.body.json();

    // バリデーション
    const validationResult = validateQuestion(body);
    if (!validationResult.valid) {
      ctx.response.status = 200;
      ctx.response.body = { status: 400, error: validationResult.message };
      return;
    }

    // データの保存
    await kv.set(["questions", String(body.questionId)], body);

    ctx.response.body = { status: 200 };
  }

  static async getQuestionByAdmin(ctx) {
    const questionId = await ctx.params.questionId;
    // バリデーション
    if (isNotNumber(questionId)) {
      ctx.response.body = Errors.INVALID_QUESTION_ID;
      return;
    }

    // データの取得
    const question = await kv.get(["questions", questionId]);
    if (question.value === null) {
      ctx.response.body = { status: 400, error: "このidのデータはありません" };
      return;
    }

    ctx.response.body = question.value;
  }

  static async getQuestion(ctx) {
    const questionId = await ctx.params.questionId;

    // バリデーション
    if (isNotNumber(questionId)) {
      ctx.response.body = Errors.INVALID_QUESTION_ID;
      return;
    }

    // ステータスによる制限
    const status = await kv.get(KeyFactory.statusKey());
    if (status.value === null) {
      ctx.response.body = Errors.BEFORE_OPEN_QUESTION;
      return;
    } else if (status.value.status === "waiting") {
      ctx.response.body = Errors.BEFORE_OPEN_QUESTION;
      return;
    } else if (
      status.value.status !== "finish" &&
      status.value.questionId < Number(questionId)
    ) {
      ctx.response.body = Errors.BEFORE_OPEN_QUESTION;
      return;
    }

    // データの取得
    const question = await kv.get(["questions", questionId]);
    if (question.value === null) {
      ctx.response.body = { status: 400, error: "このidのデータはありません" };
      return;
    }

    // 回答を削除
    delete question.value.correctChoiceId;

    ctx.response.body = question.value;
  }

  static async deleteQuestion(ctx) {
    const questionId = await ctx.params.questionId;

    // バリデーション
    if (isNotNumber(questionId)) {
      ctx.response.body = Errors.INVALID_QUESTION_ID;
    }

    // データの削除
    await kv.delete(["questions", questionId]);

    ctx.response.body = { status: 200 };
  }
}

// 質問データのバリデーションメソッド
function validateQuestion(question) {
  // 必須項目の確認
  const requiredFields = [
    "questionId",
    "imageUrl",
    "choices",
    "correctChoiceId",
  ];
  const missingFields = requiredFields.filter((field) => !(field in question));
  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `必須項目が欠けています: ${missingFields.join(", ")}`,
    };
  }

  // choicesが配列であるか、長さが4であるかを確認
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    return {
      valid: false,
      message: "'choices' フィールドは配列で、要素が4つである必要があります。",
    };
  }

  // 各choiceがchoiceIdとtextを持つか確認
  for (const choice of question.choices) {
    if (
      typeof choice.choiceId !== "number" ||
      typeof choice.text !== "string"
    ) {
      return {
        valid: false,
        message:
          "各選択肢は 'choiceId'（数値）と 'text'（文字列）を持つ必要があります。",
      };
    }
  }

  // 全ての条件を満たしていれば有効
  return { valid: true };
}

function isNotNumber(str) {
  return isNaN(str) || str.trim() === "";
}
