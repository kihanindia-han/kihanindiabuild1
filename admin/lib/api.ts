const BASE_URL = "https://kihanindiabuild1-production-8666.up.railway.app"

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

  // Products
  getProducts: () => request("/admin/products"),
  getProduct: (id: string) => request(`/admin/products/${id}`),
  createProduct: (data: any) => request("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request(`/admin/products/${id}`, { method: "DELETE" }),

  // Product images
  addProductImage: (id: string, data: any) => request(`/admin/products/${id}/images`, { method: "POST", body: JSON.stringify(data) }),
  deleteProductImage: (id: string, imageId: string) => request(`/admin/products/${id}/images/${imageId}`, { method: "DELETE" }),

  // Product variants
  addVariant: (id: string, data: any) => request(`/admin/products/${id}/variants`, { method: "POST", body: JSON.stringify(data) }),
  updateVariant: (id: string, variantId: string, data: any) => request(`/admin/products/${id}/variants/${variantId}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteVariant: (id: string, variantId: string) => request(`/admin/products/${id}/variants/${variantId}`, { method: "DELETE" }),

  // Product options
  addOption: (id: string, data: any) => request(`/admin/products/${id}/options`, { method: "POST", body: JSON.stringify(data) }),
  deleteOption: (id: string, optionId: string) => request(`/admin/products/${id}/options/${optionId}`, { method: "DELETE" }),

  // Collections
  getCollections: () => request("/admin/collections"),
  createCollection: (data: any) => request("/admin/collections", { method: "POST", body: JSON.stringify(data) }),
  updateCollection: (id: string, data: any) => request(`/admin/collections/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCollection: (id: string) => request(`/admin/collections/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (status?: string) => request(`/admin/orders${status ? `?status=${status}` : ""}`),
  getOrder: (id: string) => request(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => request(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Customers
  getCustomers: () => request("/admin/customers"),
  getCustomer: (id: string) => request(`/admin/customers/${id}`),
}
