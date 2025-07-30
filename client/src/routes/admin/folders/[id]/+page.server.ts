import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Folder {
  id: number;
  name?: string;
  description: string;
}

interface FolderResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load: ServerLoad = async ({ cookies, params }) => {
  const token = requireToken(cookies);
  const id = params.id;

  try {
    const folder = await fetchData<Folder>(
      `${BASE_URL}/private/folder/${id}`,
      token
    );

    if (!folder) {
      console.warn(`[FolderLoader] No folder found for ID: ${id}`);
      return { folder: null };
    }

    return { folder };
  } catch (error) {
    console.error("[FolderLoader] Error loading folder:", error);
    return { folder: null }; // better consistency with success path
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies);
    const formData = await request.formData();

    const id = formData.get("id")?.toString().trim() || "";
    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const grade_level_id = parseInt(
      formData.get("grade_level_id")?.toString() || "0"
    );

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!description) errors.description = "Description is required.";
    if (!grade_level_id) errors.grade_level_id = "Grade level is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("[FolderUpdate] Validation failed:", errors);
      return fail(400, { errors });
    }

    try {
      const updateUrl = `${BASE_URL}/private/folder/update/${id}`;
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          grade_level_id,
        }),
      });

      const data: FolderResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("[FolderUpdate] API rejected update:", data);
        return fail(400, {
          message: data.msg || "Updating folder failed.",
        });
      }

      console.log("[FolderUpdate] Folder updated:", data);
      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (error) {
      console.error("[FolderUpdate] Network or server error:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
