import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const FOLDER_URL = `${BASE_URL}/private/folder/`;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;

interface GradeLevel {
  id: number;
  name: string;
  description?: string;
}

interface FolderResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load: ServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  try {
    const gradelevels = await fetchData<GradeLevel[]>(GRADELEVELS_URL, token);
    console.log("[GradeLevelLoader] Grade levels loaded:", gradelevels);

    return { gradelevels };
  } catch (error) {
    console.error("[GradeLevelLoader] Failed to load grade levels:", error);
    return { gradelevels: [] };
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const grade_level_id = parseInt(
      formData.get("grade_level_id")?.toString() || "0"
    );

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!description) errors.description = "Description is required.";
    if (!grade_level_id) errors.grade_level_id = "Grade level is required.";

    if (Object.keys(errors).length) {
      return fail(400, { errors });
    }

    try {
      const res = await fetch(FOLDER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, grade_level_id, description }),
      });

      const data: FolderResponse = await res.json();

      if (!res.ok || !data.success) {
        console.error("[FolderAction] API error:", data);
        return fail(400, {
          message: data.msg || "Adding Folder failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (error) {
      console.error("[FolderAction] Connection error:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
