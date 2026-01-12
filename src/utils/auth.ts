/** 是否登录（现在永远为 true） */
export function isLoggedIn(): boolean {
  return true;
}

/** 获取当前用户 */
export function getCurrentUser() {
  return {
    username: "史文龙",
    displayName: "史文龙",
    role: "admin",
  };
}

/** 登录（占位） */
export function login(username: string, password: string) {
  return Promise.resolve({
    token: "mock-token",
    user: getCurrentUser(),
  });
}

/** 退出登录（占位） */
export function logout() {
  console.log("mock logout");
}
