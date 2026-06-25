// Centralized API client for the Aurelia backend.
export const API_BASE = "https://alrauf-backend.onrender.com/api/v1";

// ---------- token helpers ----------
const USER_TOKEN_KEY = "aurelia_user_token";
const ADMIN_TOKEN_KEY = "aurelia_admin_token";

export const tokens = {
  getUser: () => (typeof window === "undefined" ? null : localStorage.getItem(USER_TOKEN_KEY)),
  setUser: (t: string) => localStorage.setItem(USER_TOKEN_KEY, t),
  clearUser: () => localStorage.removeItem(USER_TOKEN_KEY),
  getAdmin: () => (typeof window === "undefined" ? null : localStorage.getItem(ADMIN_TOKEN_KEY)),
  setAdmin: (t: string) => localStorage.setItem(ADMIN_TOKEN_KEY, t),
  clearAdmin: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
};

// ---------- core request ----------
type ReqOpts = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  multipart?: boolean;
};

export async function api<T = any>(path: string, opts: ReqOpts = {}): Promise<T> {
  const { method = "GET", body, token, multipart } = opts;
  const headers: Record<string, string> = {};
  if (!multipart) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body == null ? undefined : multipart ? (body as FormData) : JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

// ---------- domain types ----------
export type ApiProduct = {
  _id?: string;
  id?: string | number;
  name: string;
  sub?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category?: string;
  collection?: string;
  image?: string;
  images?: { url: string; public_id: string }[] | string[];
  badge?: string;
  stock?: number;
};

// ---------- AUTH ----------
export const authApi = {
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    api("/auth/register", { method: "POST", body: data }),
  verifyOtp: (data: { email: string; otp: string }) =>
    api("/auth/verify-otp", { method: "POST", body: data }),
  login: (data: { email: string; password: string }) =>
    api<{ token: string; user?: any }>("/auth/login", { method: "POST", body: data }),
  forgotPassword: (data: { email: string }) =>
    api("/auth/forgot-password", { method: "POST", body: data }),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api("/auth/reset-password", { method: "POST", body: data }),
  me: () => api("/auth/me", { token: tokens.getUser() }),
  updateProfile: (data: Record<string, any>) =>
    api("/auth/update-profile", { method: "PUT", body: data, token: tokens.getUser() }),
  deleteAccount: (data: { email: string; password: string }) =>
    api("/auth/delete-account", { method: "POST", body: data, token: tokens.getUser() }),
};

// ---------- PRODUCTS ----------
export const productsApi = {
  list: () => api<ApiProduct[] | { products: ApiProduct[] }>("/products"),
  get: (id: string) => api<ApiProduct>(`/products/${id}`),
  create: (data: Partial<ApiProduct>) =>
    api<ApiProduct>("/products", { method: "POST", body: data, token: tokens.getAdmin() }),
  update: (id: string, data: Partial<ApiProduct>) =>
    api<ApiProduct>(`/products/${id}`, { method: "PUT", body: data, token: tokens.getAdmin() }),
  remove: (id: string) =>
    api(`/products/${id}`, { method: "DELETE", token: tokens.getAdmin() }),
};

// ---------- UPLOAD ----------
export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("image", file);
  return api<{ url: string }>("/upload", {
    method: "POST",
    body: form,
    multipart: true,
    token: tokens.getAdmin() || tokens.getUser(),
  });
}

// ---------- CART ----------
export const cartApi = {
  list: () => api("/cart", { token: tokens.getUser() }),
  add: (data: { productId: string; qty: number; size?: string }) =>
    api("/cart", { method: "POST", body: data, token: tokens.getUser() }),
  remove: (id: string) => api(`/cart/${id}`, { method: "DELETE", token: tokens.getUser() }),
};

// ---------- ORDERS ----------
export const ordersApi = {
  create: (data: Record<string, any>) =>
    api("/orders", { method: "POST", body: data, token: tokens.getUser() }),
  mine: () => api("/orders/my", { token: tokens.getUser() }),
  all: () => api("/orders", { token: tokens.getAdmin() }),
  updateStatus: (id: string, status: string) =>
    api(`/orders/${id}`, { method: "PUT", body: { status }, token: tokens.getAdmin() }),
};

// ---------- ADMIN ----------
export const adminApi = {
  login: (data: { phone: string; password: string }) =>
    api<{ token: string; user?: any }>("/auth/login", { method: "POST", body: data }),
  dashboard: () => api("/admin/dashboard", { token: tokens.getAdmin() }),
  users: () => api("/admin/users", { token: tokens.getAdmin() }),
  orders: () => api("/admin/orders", { token: tokens.getAdmin() }),
  updateOrder: (id: string, status: string) =>
    api(`/admin/orders/${id}/status`, { method: "PUT", body: { status }, token: tokens.getAdmin() }),
  verifyPayment: (id: string) =>
    api(`/admin/orders/${id}/verify-payment`, { method: "PUT", token: tokens.getAdmin() }),
  deleteUser: (id: string) =>
    api(`/admin/users/${id}`, { method: "DELETE", token: tokens.getAdmin() }),
};
