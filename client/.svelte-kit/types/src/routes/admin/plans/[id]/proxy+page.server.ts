// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Plan {
  id: number;
  title: string;
  duration: number;
  price: number;
  description: string;
  is_free: string;
}

interface PlanResponse {
  success: boolean;
  msg: string;
  token?: string;
}

async function fetchSinglePlan(token: string, id: string): Promise<Plan> {
  const planUrl = `${BASE_URL}/private/plan/${id}`;
  const res = await fetch(planUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch plan: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid plan response format");
  }

  return json.data;
}
export const load = async ({ cookies, params }: Parameters<ServerLoad>[0]) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return { plan: null };
  }

  try {
    const plan = await fetchSinglePlan(token, id);
    return { plan };
  } catch (error) {
    console.error("Failed to load plan:", error);
    return fail(500, {
      message: "Failed to load plan",
    });
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = cookies.get("token");

    const formData = await request.formData();

    const id = formData.get("id");
    const title = formData.get("title")?.toString().trim() || "";
    const duration = parseInt(formData.get("duration")?.toString() || "0", 10);
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString().trim() || "";
    const is_free = formData.get("is_free")?.toString() || "";

    const errors: Record<string, string> = {};
    if (!id) errors.id = "ID is required.";
    if (!title) errors.code = "Title is required.";
    if (!duration) errors.duration = "Duration is required.";
    if (!description) errors.description = "Description is required.";
    if (!price) errors.price = "Price is required.";
    if (!is_free) errors.is_free = "Is it Free?";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const subjectUrl = `${BASE_URL}/private/plan/update/${id}`;
      const res = await fetch(subjectUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          duration,
          price,
          description,
          is_free,
        }),
      });

      const data: PlanResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating Plan failed:", data);
        return fail(400, {
          message: data.msg || "Updating Plan failed.",
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