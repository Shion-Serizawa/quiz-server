import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";
import * as Errors from "/utils/errors.js";
import { ROLE_PERMISSIONS } from "/config/roles.js";

export const auth =
  (requiredPermissions) => async ({ cookies, response }, next) => {
    const username = await cookies.get("username");
    if (!username) {
      Errors.UNAUTHORIZED.apply(response);
      return;
    }

    const user = (await kv.get(KeyFactory.userKey(username))).value;
    if (!user) {
      Errors.UNAUTHORIZED.apply(response);
      return;
    }

    const userPermissions = ROLE_PERMISSIONS.get(user.role) ?? [];
    if (!hasPermission(requiredPermissions, userPermissions)) {
      Errors.FORBIDDEN.apply(response);
      return;
    }

    await next();
  };

function hasPermission(requiredPermissions, userPermissions) {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}
