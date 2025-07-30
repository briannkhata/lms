import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import type { Actions } from "@sveltejs/kit";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const GRADELEVEL_URL = `${BASE_URL}/private/gradelevel`;

interface GradeLevel {
  id: number;
  name?: string;
  description: string;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const [gradelevels] = await Promise.all([
      await fetchData<GradeLevel>(GRADELEVEL_URL, token),
    ]);

    return {
      gradelevels,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions: Actions = {
  deleteRecord: async ({ request, cookies }) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "api/v1/private/gradelevel/delete",
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
