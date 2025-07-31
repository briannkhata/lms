import { fail, type Actions } from "@sveltejs/kit";

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

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
      const res = await fetch("http://127.0.0.1:8001/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok || !data.token) {
        return fail(res.status, {
          message: data.message || "Invalid credentials or token missing.",
        });
      }

      const token = data.token;

      cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });

      return {
        type: "success",
        token,
        message: "Login successful",
      };
    } catch (err: any) {
      return fail(500, {
        message: "Unable to connect to login service.",
        error: err.message || String(err),
      });
    }
  },
};
