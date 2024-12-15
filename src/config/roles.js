/**
 * 新たに role, permission を追加する場合は Roles, Permissions,
 * ROLE_PERMISSIONS に設定を追加する
 *
 * see: https://github.com/Prolifode/deno_rest/blob/master/config/roles.ts
 */

export class Roles {
  static USER = "USER";
  static ADMIN = "ADMIN";
}

export class Permissions {
  // sample
  static GET_ME = "GET_ME";

  static GET_STATUS = "GET_STATUS";
  static POST_STATUS = "POST_STATUS";

  static GET_QUESTIONS = "GET_QUESTIONS";
  static POST_QUESTIONS = "POST_QUESTIONS";
  static DELETE_QUESTIONS = "DELETE_QUESTIONS";
  static ALWAYS_SEE_ANSWER = "ALWAYS_SEE_ANSWER";

  static POST_ANSWERS = "POST_ANSWERS";

  static GET_RANKING = "GET_RANKING";
}

export const ROLE_PERMISSIONS = new Map();

ROLE_PERMISSIONS.set(Roles.USER, [
  Permissions.GET_ME,

  Permissions.GET_STATUS,
  Permissions.POST_STATUS,
  Permissions.GET_QUESTIONS,

  Permissions.POST_ANSWERS,

  Permissions.GET_RANKING,
]);

ROLE_PERMISSIONS.set(Roles.ADMIN, [
  ...ROLE_PERMISSIONS.get(Roles.USER),
  Permissions.POST_QUESTIONS,
  Permissions.DELETE_QUESTIONS,
  Permissions.ALWAYS_SEE_ANSWER,
]);

export const INVITE_CODE_ROLES = new Map();
INVITE_CODE_ROLES.set(Deno.env.get("USER_INVITE_CODE"), Roles.USER);
INVITE_CODE_ROLES.set(Deno.env.get("ADMIN_INVITE_CODE"), Roles.ADMIN);
// 環境変数が未設定のときに誤ってroleが付与されるのを防止する
INVITE_CODE_ROLES.set(undefined, undefined);
