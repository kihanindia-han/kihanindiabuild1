const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kihanindiabuild1-production-8666.up.railway.app"

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("kihan_admin_token") : null
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }))
    throw new Error(err.message || "Request failed")
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  login: (email: string, password: string) =>
    request("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getProducts: () => request("/admin/products"),
  getProduct: (id: string) => request(`/admin/products/${id}`),
  createProduct: (data: any) => request("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request(`/admin/products/${id}`, { method: "DELETE" }),

  getCollections: () => request("/admin/collections"),
  createCollection: (data: any) => request("/admin/collections", { method: "POST", body: JSON.stringify(data) }),
  deleteCollection: (id: string) => request(`/admin/collections/${id}`, { method: "DELETE" }),
}
