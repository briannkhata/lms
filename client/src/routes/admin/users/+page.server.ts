import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const USERS_URL = `${BASE_URL}/private/user`;

interface GradeLevel {
  id: number;
  name: string;
}
interface Plan {
  id: number;
  title: string;
  duration: number;
}
interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
}

interface User {
  id: number;
  email?: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone: string;
  address?: string;
  date_of_birth: string;
  city?: string;
  district?: string;
  town?: string;
  current_school?: string;
  image?: string;
  grade_level_id: number;
  gradelevel?: GradeLevel;
  plan_id: number;
  plan?: Plan;
  role?: string; // default 'student'
  is_online?: number; // 0 or 1
  deleted?: number; // 0 or 1
  deleted_at?: string; // or Date
  created_at?: string; // or Date
  updated_at?: string; // or Date
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const [users] = await Promise.all([
      await fetchData<User>(USERS_URL, token),
    ]);

    return {
      users,
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
        endpointPath: "private/user/delete",
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
