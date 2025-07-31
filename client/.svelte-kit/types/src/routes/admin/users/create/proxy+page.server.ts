// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";

interface UserResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = requireToken(cookies);

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() ?? "";
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString().trim() ?? "";
    //const phone = formData.get("phone")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const role = "admin";

    const fields = {
      name,
      username,
      password,
      //phone,
      email,
      role,
    };

    const errors: Record<string, string> = {};

    if (!name) errors.name = "Name is required.";
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    //if (!phone) errors.phone = "Phone number is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Valid email is required.";
    }
    if (!role) errors.role = "Role is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, values: fields });
    }

    try {
      const res = await fetch("http://127.0.0.1:8001/api/v1/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      const data: UserResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("User creation failed:", data);
        return fail(res.status, {
          message: data.message || "User creation failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.message,
      };
    } catch (err) {
      console.error("API connection error:", err);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
;null as any as Actions;