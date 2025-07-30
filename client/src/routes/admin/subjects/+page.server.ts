import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import type { Actions } from "@sveltejs/kit";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const SUBJECTS_URL = `${BASE_URL}/private/subject/`;

interface Subject {
  id: number;
  code: string;
  name: string;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { subjects: null };
  }

  try {
    const [subjects] = await Promise.all([
      fetchData<Subject[]>(SUBJECTS_URL, token),
    ]);

    return { subjects };
  } catch (error) {
    console.error("Error in load function:", error);
    return { subjects: null };
  }
};

export const actions: Actions = {
  deleteRecord: async ({ request, cookies }) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "private/subject/delete",
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
