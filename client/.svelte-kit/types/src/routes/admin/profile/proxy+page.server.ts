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
    const [gradelevels, plans, userOne] = await Promise.all([
      await fetchData<GradeLevel>(GRADELEVELS_URL, token),
      await fetchData<Plan>(PLANS_URL, token),
      await fetchData<User>(`${BASE_URL}/private/user/${userID}`, token),
    ]);

    return {
      gradelevels,
      plans,
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
      name: formData.get("name")?.toString().trim() || "",
      gender: formData.get("gender")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      date_of_birth: formData.get("date_of_birth")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      address: formData.get("address")?.toString().trim() || "",
      city: formData.get("city")?.toString().trim() || "",
      district: formData.get("district")?.toString().trim() || "",
      town: formData.get("town")?.toString().trim() || "",
      current_school: formData.get("current_school")?.toString().trim() || "",
    };

    console.log("Parsed fields:", fields);

    // Validation
    const errors: Record<string, string> = {};

    if (!fields.name) errors.name = "Name is required.";
    if (!fields.gender) errors.gender = "Gender is required.";
    if (!fields.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{9,15}$/.test(fields.phone)) {
      errors.phone = "Phone number must be between 9 and 15 digits.";
    }

    if (!fields.date_of_birth) {
      errors.date_of_birth = "Date of birth is required.";
    } else if (isNaN(Date.parse(fields.date_of_birth))) {
      errors.date_of_birth = "Date of birth must be a valid date.";
    }

    if (!fields.email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = "Email format is invalid.";
    }

    if (!fields.address) errors.address = "Address is required.";
    if (!fields.city) errors.city = "City is required.";
    if (!fields.district) errors.district = "District is required.";
    if (!fields.town) errors.town = "Town is required.";
    if (!fields.current_school)
      errors.current_school = "Current school is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors found:", errors);
      return fail(400, { errors });
    }

    const payload = {
      email: fields.email,
      name: fields.name,
      phone: fields.phone,
      address: fields.address,
      date_of_birth: fields.date_of_birth,
      city: fields.city,
      district: fields.district,
      town: fields.town,
      current_school: fields.current_school,
      gender: fields.gender,
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