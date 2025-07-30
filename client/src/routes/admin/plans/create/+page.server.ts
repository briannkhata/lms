import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const CREATE_URL = `${BASE_URL}/private/plan`;

interface PlanResponse {
  success: boolean;
  msg: string;
  token?: string;
}

function validateForm(data: {
  title: string;
  duration: number;
  price: string;
  description: string;
  is_free: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.title) errors.title = "Title is required.";
  if (!data.duration) errors.duration = "Duration is required.";
  if (!data.price) errors.price = "Price is required.";
  if (!data.description) errors.description = "Description is required.";
  if (data.is_free === null || data.is_free === undefined)
    errors.is_free = "Please specify if the plan is free.";

  return errors;
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");

    if (!token) {
      return fail(401, { message: "Unauthorized: No token provided." });
    }

    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim() || "";
    const duration = parseInt(formData.get("duration")?.toString() || "0", 10);
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString().trim() || "";
    const is_free = formData.get("is_free")?.toString() || "";

    const errors = validateForm({
      title,
      duration,
      price,
      description,
      is_free,
    });

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const response = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          duration,
          price,
          description,
          is_free: is_free === "1" ? 1 : 0,
        }),
      });

      const data: PlanResponse = await response.json();

      if (!response.ok || !data.success) {
        console.error("API Error:", data);
        return fail(400, {
          message: data.msg || "Failed to create plan.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (err) {
      console.error("Network Error:", err);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
