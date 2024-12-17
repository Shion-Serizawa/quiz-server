import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import * as Errors from "/utils/errors.js";
import { ROLE_PERMISSIONS } from "/config/roles.js";

export const auth =
  (requiredPermissions) => async ({ request, state, response }, next) => {
    const username = request.headers.get("Authorization")?.split(" ")?.at(1);
    if (!username) {
      response.body = Errors.UNAUTHORIZED;
      return;
    }

    const user = (await kv.get(KeyFactory.userKey(username))).value;
    if (!user) {
      response.body = Errors.UNAUTHORIZED;
      return;
    }

    const userPermissions = ROLE_PERMISSIONS.get(user.role) ?? [];
    if (!hasPermission(requiredPermissions, userPermissions)) {
      response.body = Errors.FORBIDDEN;
      return;
    }

    state.username = username;

    await next();
  };

function hasPermission(requiredPermissions, userPermissions) {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}
