import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const CREATE_URL = `${BASE_URL}/private/subscription/`;
const PLANS_URL = `${BASE_URL}/private/plan`;
const USERS_URL = `${BASE_URL}/private/user/students`;

interface User {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  title: string;
  duration: number;
}

interface RequestResponse {
  success: boolean;
  msg: string;
  token?: string;
}

async function fetchUsers(token: string): Promise<User[]> {
  const res = await fetch(USERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || !Array.isArray(json.data)) {
    throw new Error("Invalid user response format");
  }

  return json.data;
}

async function fetchPlans(token: string): Promise<Plan[]> {
  const res = await fetch(PLANS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || !Array.isArray(json.data)) {
    throw new Error("Invalid plans response format");
  }

  return json.data;
}

export const load: ServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  if (!token) {
    console.warn("No auth token found");
    return {
      users: [] as User[],
      plans: [] as Plan[],
    };
  }

  try {
    const [users, plans] = await Promise.all([
      fetchUsers(token),
      fetchPlans(token),
    ]);

    return { users, plans };
  } catch (error) {
    console.error("Failed to load data:", error);
    return fail(500, {
      message: "Failed to load data",
    });
  }
};
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies);

    const formData = await request.formData();

    const rawPlanId = formData.get("plan_id")?.toString() ?? "";
    const rawUserId = formData.get("user_id")?.toString() ?? "";
    const rawStatus = formData.get("status")?.toString() ?? "";
    const rawStartDate = formData.get("start_date")?.toString() ?? "";

    const fields = {
      plan_id: parseInt(rawPlanId),
      user_id: parseInt(rawUserId),
      status: parseInt(rawStatus),
      start_date: formatDate(rawStartDate),
    };

    const errors: Record<string, string> = {};

    if (!rawPlanId || isNaN(fields.plan_id))
      errors.plan_id = "Plan is required.";
    if (!rawUserId || isNaN(fields.user_id))
      errors.user_id = "Student is required.";
    if (!fields.start_date) errors.start_date = "Start Date is required.";
    if (!rawStatus || isNaN(fields.status))
      errors.status = "Status is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, values: fields });
    }

    const payload = {
      plan_id: fields.plan_id,
      user_id: fields.user_id,
      start_date: fields.start_date,
      status: fields.status,
    };

    try {
      const res = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return fail(res.status, {
          message: `Server error: ${res.statusText}`,
        });
      }

      const data: RequestResponse = await res.json();

      if (!data.success) {
        return fail(400, {
          message: data.msg || "Request failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (err) {
      console.error("Error:", err);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};

function formatDate(value: string): string {
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toISOString();
}
