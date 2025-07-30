import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Plan {
  id: number;
  title: string;
  duration: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  plan_id: number;
  plan?: Plan;
  user_id: number;
  user?: User;
  status: number;
  created_by?: number;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  try {
    const [subscriptions] = await Promise.all([
      await fetchData<Subscription>(`${BASE_URL}/private/subscription`, token),
    ]);

    return {
      subscriptions,
    };
  } catch (error) {
    return { subscriptions: null };
  }
};

export const actions: Actions = {
  deleteRecord: async ({ request, cookies }) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "private/subscription/delete",
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
      return {
        type: "failure",
        data: {
          message: "An unexpected error occurred.",
        },
      };
    }
  },
};
