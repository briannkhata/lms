import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const GRADELEVEL_URL = `${BASE_URL}/private/gradelevel`;

interface GradeLevelResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");

    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!description) errors.description = "Description is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const res = await fetch(GRADELEVEL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data: GradeLevelResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Adding GradeLevel failed:", data);
        return fail(400, {
          message: data.msg || "Adding GradeLevel failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (error) {
      console.error("Connection error:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
