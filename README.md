# Quiz Server

`.env` ファイルを作成し、環境変数を設定する

| 環境変数                  | 値                                                                 |
| ------------------------- | ------------------------------------------------------------------ |
| SUPABASE_URL              | Project URL                                                        |
| SUPABASE_SERVICE_ROLE_KEY | Service Role Key                                                   |
| USER_INVITE_CODE          | user invite code                                                   |
| ADMIN_INVITE_CODE         | admin invite code                                                  |
| COOKIE_SECRET_KEY         | This will be used to sign cookies to help prevent cookie tampering |

```
$ deno task start
```

# mainのデプロイ先

[https://seri-quiz-server-98.deno.dev/](https://seri-quiz-server-98.deno.dev/)
