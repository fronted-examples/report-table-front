/**
 * 第三方授权所需参数
 */
export const AUTH_PARAMS = {
  url: "http://localhost:8001/author/oauth/authorize",
  redirect_uri: "http://localhost:8080/callback",
  client_id: "client3",
  response_type: "code",
  scope: "profile",
}

/**
 * 第三方授权登录所需参数
 */
export const AUTH_LOGIN_PARAMS = {
  redirect_uri: "http://localhost:8080/callback",
  client_id: "client3",
  client_secret: "123456",
  scope: "profile",
  grant_type: "authorization_code"
}
