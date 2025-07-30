import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import type { Actions } from "@sveltejs/kit";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const PLANS_URL = `${BASE_URL}/private/plan`;

interface Plan {
  id: number;
  title: string;
  duration: number;
  price: number;
  description: string;
  is_free: number;
  created_by?: number;
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
    const [plans] = await Promise.all([
      await fetchData<Plan>(PLANS_URL, token),
    ]);

    return {
      plans,
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
        endpointPath: "private/plan/delete",
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
