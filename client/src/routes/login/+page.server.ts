// +page.server.ts
import { fail, type Actions } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";


const BASE_URL = env.PUBLIC_API_BASE_URL;
const LOGIN_URL = `${BASE_URL}/user/login`;

interface AuthResponse {
  success: boolean;
  msg?: string;
  token?: string;
}

export const load: ServerLoad = async () => {
  return {}; // Optional: remove entirely if no `load()` logic is needed
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString().trim() ?? "";

    const errors: Record<string, string> = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        message: "Please fix the errors and try again.",
      });
    }

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as AuthResponse;

      if (!res.ok || !data.success || !data.token) {
        return fail(res.status || 401, {
          message: data.msg || "Invalid credentials or missing token.",
        });
      }

      cookies.set("token", data.token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return {
        type: "success",
        success: true,
       // message: data.msg ?? "Login successful.",
        token: data.token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {
        message: "Unable to connect to login service. Please try again later.",
      });
    }
  },
};
