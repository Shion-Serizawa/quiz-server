/**
 * usage:
 *
 * import * as Errors from "/utils/errors.js";
 * const error = Errors.BAD_REQUEST;
 */

export const BAD_REQUEST = error(400, "Bad Request");
export const UNAUTHORIZED = error(401, "Unauthorized");
export const FORBIDDEN = error(403, "Forbidden");
export const INTERNAL_SERVER_ERROR = error(500, "Internal Server Error");

export const INVALID_USERNAME = error(
  1001,
  "このユーザー名は使用できません",
);
export const UNKNOWN_INVITE_CODE = error(
  1002,
  "不明な招待コード",
);
export const WRONG_USERNAME_OR_PASSWORD = error(
  1003,
  "ユーザー名またはパスワードが誤っています",
);
export const NOT_LOGIN = error(1004, "ログインしてください");

export const NOT_STATUS = error(
  1005,
  "ステータス（ゲーム進行状況）がありません",
);

export const NOT_ANSWER = error(1006, "回答がありません");

export const INVALID_QUESTION_ID = error(1101, "問題は数字で取得してください");
export const BEFORE_OPEN_QUESTION = error(1102, "問題はまだ公開されていません");

function error(code, message) {
  return { error: { code, message } };
}
