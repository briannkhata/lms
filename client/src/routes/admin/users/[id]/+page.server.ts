import { requireToken } from "$lib/utils/requireToken";
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  //phone?: string;
  password?: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  token?: string;
}
async function fetchSingleUser(token: string, id: string): Promise<User> {
  const res = await fetch(`http://127.0.0.1:8001/api/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch parcel: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid parcel response format");
  }

  return json.data;
}

export const load: ServerLoad = async ({ cookies, params }) => {
  const token = requireToken(cookies);
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return { user: null };
  }

  try {
    const user = await fetchSingleUser(token, id);
    return { user };
  } catch (error) {
    console.error("Failed to load user:", error);
    return fail(500, {
      message: "Failed to load user",
    });
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies);

    const formData = await request.formData();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString().trim() ?? "";
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString().trim() ?? "";
    //const phone = formData.get("phone")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const role = "admin";

    const errors: Record<string, string> = {};

    // Validations
    if (!username) errors.username = "Username is required.";
    //if (!phone) errors.phone = "Phone is required.";
    if (!email) errors.email = "Email is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    // Build the payload conditionally
    const bodyPayload: any = {
      name,
      username,
      //phone,
      role,
      email,
    };
    if (password.length > 0) {
      bodyPayload.password = password;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8001/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data: UserResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating user failed:", data);
        return fail(400, {
          message: data.message || "Updating user failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Connection error:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
