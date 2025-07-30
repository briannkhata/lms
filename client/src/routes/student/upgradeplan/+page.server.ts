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
  duration: number;
  price: number;
  description: string;
  is_free: number;
}

interface RequestResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  try {
    const plans = await fetchData<Plan>(PLANS_URL, token);
    return {
      plans,
    };
  } catch (error) {
    return { plan: null };
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies);
    const formData = await request.formData();

    const fields = {
      id: formData.get("id"),
      plan_id: formData.get("plan_id")?.toString().trim() || "",
      start_date: formData.get("start_date")?.toString().trim() || "",
      payment_method: formData.get("payment_method")?.toString().trim() || "",
      amount: formData.get("amount")?.toString().trim() || "",
    };

    console.log("Parsed fields:", fields);

    const requiredKeys = ["plan_id", "start_date", "payment_method", "amount"];
    const errors: Record<string, string> = {};

    for (const key of requiredKeys) {
      if (!fields[key]) {
        errors[key] = `${key.replace("_", " ")} is required.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      plan_id: fields.plan_id,
      start_date: fields.start_date,
      payment_method: fields.payment_method,
      amount: fields.amount,
    };

    console.log("Prepared payload:", payload);

    try {
      const userUrl = `${BASE_URL}/private/plan/upgrade`;
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
        console.error("Updating User failed:", data);
        return fail(400, {
          message: data.msg || "Updating User failed.",
        });
      }

      console.log("User updated successfully:", data.msg);
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
