// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import { type Actions } from "@sveltejs/kit";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const FOLDER_URL = `${BASE_URL}/private/folder/`;

interface Folder {
  id: number;
  name?: string;
  description: string;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const [folders] = await Promise.all([
      await fetchData<Folder>(FOLDER_URL, token),
    ]);

    return {
      folders,
    };
  } catch (error) {
    console.error("Error in loading folders:", error);
    return { user: null };
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