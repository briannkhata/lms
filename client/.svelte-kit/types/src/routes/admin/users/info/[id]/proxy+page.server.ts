// @ts-nocheck
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface GradeLevel {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  title: string;
  duration: number;
}

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
  grade_level: GradeLevel;
  role: string;
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

interface UserResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load = async ({ params, cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const id = params.id;

  try {
    const [users] = await Promise.all([
      await fetchData<User>(`${BASE_URL}/private/user/advanced/${id}`, token),
    ]);

    return {
      users,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = cookies.get("token");
    console.log("Token retrieved:", token ? "[REDACTED]" : "None");

    const formData = await request.formData();
    console.log("Form data received:", Array.from(formData.entries()));

    // Extract form values
    const fields = {
      id: formData.get("id"),
      name: formData.get("first_name")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      date_of_birth: formData.get("date_of_birth")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      district: formData.get("district")?.toString() || "",
      town: formData.get("town")?.toString() || "",
      current_school: formData.get("current_school")?.toString() || "",
      grade_level_id: formData.get("grade_level_id")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      username: formData.get("username")?.toString() || "",
    };

    console.log("Parsed fields:", fields);

    // Validation
    const errors: Record<string, string> = {};

    if (!fields.name) errors.first_name = "Name is required.";
    if (!fields.username) errors.username = "Username is required.";

    if (!fields.phone) errors.phone = "Phone number is required.";
    if (!fields.role) errors.role = "Role is required.";
    if (fields.role === "student" && !fields.grade_level_id) {
      errors.grade_level_id = "Grade level is required for students.";
    }
    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      email: fields.email,
      username: fields.username,
      name: fields.name,
      phone: fields.phone,
      address: fields.address,
      date_of_birth: fields.date_of_birth,
      city: fields.city,
      district: fields.district,
      town: fields.town,
      current_school: fields.current_school,
      grade_level_id: fields.grade_level_id,
      role: fields.role,
    };

    console.log("Prepared payload:", payload);

    try {
      const userUrl = `${BASE_URL}/private/user/update/${fields.id}`;
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
;null as any as Actions;