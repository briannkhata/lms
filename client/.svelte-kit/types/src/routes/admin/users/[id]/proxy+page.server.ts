// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const PLANS_URL = `${BASE_URL}/private/plan`;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;

interface User {
  name: string;
  gender: string;
  phone: string;
  date_of_birth: string;
  email: string;
  address: string;
  city: string;
  district: string;
  town: string;
  current_school: string;
  grade_level_id: string;
  role: string;
}
interface GradeLevel {
  id: number;
  name: string;
}

interface UserResponse {
  success: boolean;
  msg: string;
  token?: string;
}

async function fetchSingleUser(token: string, id: string): Promise<User> {
  const userUrl = `${BASE_URL}/private/user/${id}`;
  const res = await fetch(userUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid user response format");
  }

  return json.data;
}

async function fetchGradeLevels(token: string): Promise<GradeLevel[]> {
  const res = await fetch(GRADELEVELS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch grade levels: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();
  if (!json?.data || !Array.isArray(json.data)) {
    throw new Error("Invalid grade levels response format");
  }

  return json.data;
}

export const load = async ({ cookies, params }: Parameters<ServerLoad>[0]) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return {
      gradeLevels: [] as GradeLevel[],
      user: [] as User[],
    };
  }

  try {
    const [gradeLevels, user] = await Promise.all([
      fetchGradeLevels(token),
      fetchSingleUser(token, id),
    ]);

    return { gradeLevels, user };
  } catch (error) {
    console.error("Failed to load data:", error);
    return fail(500, {
      message: "Failed to load data",
    });
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = requireToken(cookies);

    const formData = await request.formData();
    const fields = {
      id: formData.get("id"),
      password: formData.get("password")?.toString() || "",
    };

    const errors: Record<string, string> = {};

    if (!fields.password) errors.password = "Enter Password";

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      password: fields.password,
    };

    try {
      const userUrl = `${BASE_URL}/private/user/password/${fields.id}`;
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
        return fail(400, {
          message: data.msg,
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