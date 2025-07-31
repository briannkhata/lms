import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Subject {
  id: number;
  code?: string;
  name: string;
}

interface SubjectResponse {
  success: boolean;
  msg: string;
  token?: string;
}

async function fetchSingleSubject(token: string, id: string): Promise<Subject> {
  const subjectUrl = `${BASE_URL}/private/subject/${id}`;
  const res = await fetch(subjectUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch subject: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid subject response format");
  }

  return json.data;
}
export const load: ServerLoad = async ({ cookies, params }) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return { subject: null };
  }

  try {
    const subject = await fetchSingleSubject(token, id);
    return { subject };
  } catch (error) {
    console.error("Failed to load subject:", error);
    return fail(500, {
      message: "Failed to load subject",
    });
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");

    const formData = await request.formData();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const code = formData.get("code")?.toString() || "";

    const errors: Record<string, string> = {};
    if (!id) errors.id = "ID is missing.";
    if (!code) errors.code = "Code is required.";
    if (!name) errors.name = "Name is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const subjectUrl = `${BASE_URL}/private/subject/update/${id}`;
      const res = await fetch(subjectUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          code,
        }),
      });

      const data: SubjectResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating Subject failed:", data);
        return fail(400, {
          message: data.msg || "Updating Subject failed.",
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
