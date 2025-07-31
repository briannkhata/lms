// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
//import { BASE_URL, USERS_URL, PLANS_URL } from "$lib/constants";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const PLANS_URL = `${BASE_URL}/private/plan`;
const USERS_URL = `${BASE_URL}/private/user`;

interface User {
  id: number;
  first_name: string;
  last_name: string;
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
  plan_id: number;
  plan?: Plan;
  user_id: number;
  user?: User;
  status: string;
}

interface RequestResponse {
  success: boolean;
  msg: string;
  token?: string;
}

const fetchWithToken = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch error: ${url} - ${res.status} ${res.statusText}`);
  }

  return res.json();
};

async function fetchSubscription(
  token: string,
  id: string
): Promise<Subscription> {
  const json = await fetchWithToken(
    `${BASE_URL}/private/subscription/${id}`,
    token
  );

  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid subscription response format");
  }

  return json.data as Subscription;
}

async function fetchUsers(token: string): Promise<User[]> {
  const json = await fetchWithToken(USERS_URL, token);

  if (!json?.data || !Array.isArray(json.data)) {
    throw new Error("Invalid users response format");
  }

  return json.data as User[];
}

async function fetchPlans(token: string): Promise<Plan[]> {
  const json = await fetchWithToken(PLANS_URL, token);

  if (!json?.data || !Array.isArray(json.data)) {
    throw new Error("Invalid plans response format");
  }

  return json.data as Plan[];
}

export const load = async ({ cookies, params }: Parameters<ServerLoad>[0]) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return {
      users: [] as User[],
      plans: [] as Plan[],
      subscription: null as Subscription | null,
    };
  }

  try {
    const [users, plans, subscription] = await Promise.all([
      fetchUsers(token),
      fetchPlans(token),
      fetchSubscription(token, id),
    ]);

    return { users, plans, subscription };
  } catch (error) {
    console.error("Failed to load data:", error);
    return fail(500, {
      message: "Failed to load subscription data.",
    });
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = cookies.get("token");
    console.log("Token retrieved:", token ? "[REDACTED]" : "None");

    const formData = await request.formData();
    console.log("Form data received:", Array.from(formData.entries()));

    // Extract and coerce fields
    const fields = {
      id: formData.get("id")?.toString() || "",
      status: parseInt(formData.get("status")?.toString() || ""),
    };

    console.log("Parsed fields:", fields);

    // Validation
    const errors: Record<string, string> = {};
    if (!fields.id) errors.id = "Subscription ID is required.";
    if (isNaN(fields.status)) errors.status = "Status is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      status: fields.status,
    };

    console.log("Prepared payload:", payload);

    try {
      const userUrl = `${BASE_URL}/private/subscription/updatestatus/${fields.id}`;
      console.log("Sending PUT request to:", userUrl);

      const res = await fetch(userUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: RequestResponse = await res.json();
      console.log("Response from server:", data);

      if (!res.ok || data.success === false) {
        console.error("Updating subscription failed:", data);
        return fail(400, {
          message: data.msg || "Updating subscription failed.",
        });
      }

      console.log("Subscription updated successfully:", data.msg);
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