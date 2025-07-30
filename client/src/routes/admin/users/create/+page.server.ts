import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const CREATE_URL = `${BASE_URL}/private/user/`;

interface RequestResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies, "/");

    const formData = await request.formData();

    const fields = {
      name: formData.get("name")?.toString().trim() || "",
      username: formData.get("username")?.toString().trim() || "",
      password: formData.get("password")?.toString() || "",
      email: formData.get("email")?.toString().trim() || "",
      gender: formData.get("gender")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      address: formData.get("address")?.toString().trim() || "",
      role: formData.get("role")?.toString().trim() || "",
    };

    const errors: Record<string, string> = {};

    // Validate input
    if (!fields.name) errors.name = "Name is required.";
    if (!fields.username) errors.username = "Username is required.";
    if (!fields.password) errors.password = "Password is required.";
    if (!fields.email) errors.email = "Email is required.";
    if (!fields.phone) errors.phone = "Phone number is required.";
    if (!fields.gender) errors.gender = "Gender is required.";
    if (!fields.address) errors.address = "Address is required.";
    if (!fields.role) errors.role = "Role is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        values: fields,
      });
    }

    // Build payload
    const payload = { ...fields };

    try {
      const res = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Payload:", payload);

      const data: RequestResponse = await res.json();

      if (!res.ok) {
        // Distinguish between 400/409/500 errors
        return fail(res.status, {
          message: data?.msg || `Server error: ${res.statusText}`,
        });
      }

      if (!data.success) {
        return fail(400, {
          message: data.msg,
        });
      }

      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (err) {
      console.error("User creation failed:", err);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
