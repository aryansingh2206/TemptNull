// client/lib/auth.ts

// 🔐 Check if token exists and is valid
export function isTokenValid(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (err) {
    return false;
  }
}

// ✅ Get auth status
export const isAuthenticated = (): boolean => {
  return isTokenValid();
};

// ☑️ Optional utility to manually set auth (legacy support)
export const setAuth = (value: boolean) => {
  localStorage.setItem("auth", value ? "true" : "false");
};

// 🚪 Centralized logout function
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("auth");

  // Optional: show toast if you use 'sonner'
  // import { toast } from "sonner";
  // toast.success("Logged out successfully");

  // Redirect
  window.location.href = "/login";
}
