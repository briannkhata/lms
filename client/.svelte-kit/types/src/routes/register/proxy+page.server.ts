// @ts-nocheck
import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const REGISTER_URL = `${BASE_URL}/front/register`;

interface RegisterResponse {
  success: boolean;
  msg?: string;
  errors?: Record<string, string>;
}

export const actions = {
  default: async ({ request }: import('./$types').RequestEvent) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim() ?? "";
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString().trim() ?? "";
    const grade_level_id = parseInt(
      formData.get("grade_level_id").toString().trim()
    );

    console.log("📝 Registration Form Data:", {
      name,
      username,
      password: password ? "[REDACTED]" : "(empty)",
      grade_level_id,
    });

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    if (!grade_level_id) errors.grade_level_id = "Class is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("⚠️ Validation failed with errors:", errors);
      return fail(400, {
        errors,
        message: "Please fix the errors and try again.",
      });
    }

    try {
      const payload = {
        username,
        password,
        name,
        grade_level_id,
      };

      console.log("📡 Sending registration request to:", REGISTER_URL);
      console.log("📦 Request payload:", payload);

      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: RegisterResponse = await res.json();

      console.log("✅ Server response:", data);

      if (!res.ok || !data.success) {
        console.warn("❌ Registration failed with server response:", data);
        return fail(res.status || 400, {
          errors: data.errors || {},
          message: data.msg || "Registration failed.",
        });
      }

      console.log("🎉 Registration successful:", data);
      return {
        type: "success",
        success: true,
        message: data.msg ?? "Registration successful.",
      };
    } catch (err) {
      console.error("🔥 Registration error:", err);
      return fail(500, {
        message: "Unable to connect to registration service.",
      });
    }
  },
};
;null as any as Actions;