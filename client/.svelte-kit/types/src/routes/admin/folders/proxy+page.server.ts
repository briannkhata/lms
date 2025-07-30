// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import { type Actions } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const FOLDER_URL = `${BASE_URL}/private/folder/`;

interface GradeLevel {
  id: number;
  name: string;
  description?: string;
}

interface Folder {
  id: number;
  name?: string;
  description: string;
  grade_level_id: number;
  grade_level?: GradeLevel;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);

  try {
    const folders = await fetchData<Folder[]>(FOLDER_URL, token);
    console.log("[FoldersLoader] Folders loaded:", folders);
    return { folders };
  } catch (error) {
    console.error("[FoldersLoader] Error loading folders:", error);
    return { folders: [] };
  }
};

export const actions = {
  deleteRecord: async ({ request, cookies }: import('./$types').RequestEvent) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "private/folder/delete",
      });

      if ("success" in result && !result.success) {
        return {
          type: "failure",
          data: result,
        };
      }

      return {
        type: "success",
        data: result,
      };
    } catch (error) {
      console.error("Delete failed:", error);
      return {
        type: "failure",
        data: {
          message: "An unexpected error occurred.",
        },
      };
    }
  },
};
;null as any as Actions;