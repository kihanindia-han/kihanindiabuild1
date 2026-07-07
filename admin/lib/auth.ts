export function saveToken(token: string) {
  localStorage.setItem("kihan_admin_token", token)
}

export function clearToken() {
  localStorage.removeItem("kihan_admin_token")
}

export function getToken() {
  return localStorage.getItem("kihan_admin_token")
}

export function isLoggedIn() {
  return !!getToken()
}
