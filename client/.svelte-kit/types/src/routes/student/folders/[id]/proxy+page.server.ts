// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";
import type { PageServerLoad } from "../$types";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface GradeLevel {
  id: number;
  name?: string;
}
interface Folder {
  id: number;
  name?: string;
}
interface Subject {
  id: number;
  name?: string;
  code?: string;
}

interface Lesson {
  id: number;
  code?: string;
  title: string;
  content_type: string;
  description: string;
  subject_id: string;
  subject?: Subject;
  grade_level_id: string;
  gradelevel?: GradeLevel;
  folder_id: string;
  folder?: Folder;
  created_by?: number;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const folderID = params.id;

  if (!folderID) {
    console.warn("[LessonsLoader] Missing folderID in route params");
    return { lessons: [] };
  }

  const lessons = await fetchData<Lesson[]>(
    `${BASE_URL}/private/lesson/folder/${folderID}`,
    token
  );
  console.log("[LessonsLoader] Loaded lessons:", lessons);
  return { lessons };
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
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
      const gradelevelUrl = `${BASE_URL}/private/folder/update/${id}`;
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

      const data: FolderResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating Folder failed:", data);
        return fail(400, {
          message: data.msg || "Updating Folder failed.",
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
;null as any as Actions;