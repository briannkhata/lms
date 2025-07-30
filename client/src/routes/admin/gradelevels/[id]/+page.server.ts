import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface GradeLevel {
  id: number;
  name?: string;
  description: string;
}

interface GradeLevelResponse {
  success: boolean;
  msg: string;
  token?: string;
}

async function fetchSingleGradeLevel(
  token: string,
  id: string
): Promise<GradeLevel> {
  const gradelevelUrl = `${BASE_URL}/private/gradelevel/${id}`;
  const res = await fetch(gradelevelUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch gradelevel: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid gradelevel response format");
  }

  return json.data;
}
export const load: ServerLoad = async ({ cookies, params }) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return { gradelevel: null };
  }

  try {
    const gradelevel = await fetchSingleGradeLevel(token, id);
    return { gradelevel };
  } catch (error) {
    console.error("Failed to load gradelevel:", error);
    return fail(500, {
      message: "Failed to load gradelevel",
    });
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");

    const formData = await request.formData();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

    const errors: Record<string, string> = {};
    if (!id) errors.id = "ID is missing.";
    if (!name) errors.name = "Name is required.";
    if (!description) errors.description = "Description is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const gradelevelUrl = `${BASE_URL}/private/gradelevel/update/${id}`;
      const res = await fetch(gradelevelUrl, {
        method: "PUT",
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
        console.error("Updating GradeLevel failed:", data);
        return fail(400, {
          message: data.msg || "Updating GradeLevel failed.",
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
