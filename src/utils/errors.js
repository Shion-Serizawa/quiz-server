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

export const INVALID_USERNAME = error_original(
  400,
  1001,
  "このユーザー名は使用できません",
);
export const UNKNOWN_INVITE_CODE = error_original(
  400,
  1002,
  "不明な招待コード",
);
export const WRONG_USERNAME_OR_PASSWORD = error_original(
  400,
  1003,
  "ユーザー名またはパスワードが誤っています",
);
export const NOT_LOGIN = error(1004, "ログインしてください");

function error(status, message) {
  return {
    status,
    body: { error: { code: status, message } },
    // response に直接適用するメソッド
    apply(response) {
      response.status = status;
      response.body = this.body;
    },
  };
}

function error_original(status, code, message) {
  return {
    status,
    body: { error: { code: code, message } },
    // response に直接適用するメソッド
    apply(response) {
      response.status = status;
      response.body = this.body;
    },
  };
}
