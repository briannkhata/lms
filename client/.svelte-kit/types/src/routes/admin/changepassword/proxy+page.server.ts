// @ts-nocheck
import type { PageServerLoad } from "./$types";
import type { Actions, Cookies } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";

import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;
const PLANS_URL = `${BASE_URL}/private/plan`;

interface GradeLevel {
  id: number;
  name: string;
}
interface Plan {
  id: number;
  title: string;
}

interface UserResponse {
  success: boolean;
  msg: string;
  token?: string;
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

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const decoded: any = jwtDecode(token);
  const userID = decoded.userId;

  try {
    const [userOne] = await Promise.all([
      await fetchData<User>(`${BASE_URL}/private/user/${userID}`, token),
    ]);

    return {
      userOne,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = requireToken(cookies);
    const formData = await request.formData();

    const fields = {
      id: formData.get("id"),
      password: formData.get("password")?.toString().trim() || "",
    };

    console.log("Parsed fields:", fields);

    // Validation
    const errors: Record<string, string> = {};
    if (!fields.password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      password: fields.password,
    };

    try {
      const userUrl = `${BASE_URL}/private/user/password/${fields.id}`;
      console.log("Sending PUT request to:", userUrl);

      const res = await fetch(userUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: UserResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating User failed:", data);
        return fail(400, {
          message: data.msg || "Updating User failed.",
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