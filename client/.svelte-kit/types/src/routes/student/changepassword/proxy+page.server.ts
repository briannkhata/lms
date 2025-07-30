// @ts-nocheck
import type { PageServerLoad } from "./$types";
import type { Actions, Cookies } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";

import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface RequestResponse {
  success: boolean;
  msg: string;
  token?: string;
}

interface User {
  id: number;
  username: string;
  password: string;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const decoded: any = jwtDecode(token);
  const userID = decoded.userId;

  try {
    const userOne = await fetchData<User>(
      `${BASE_URL}/private/user/${userID}`,
      token
    );

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
    if (!fields.password) errors.password = "Please enter new password";

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

      const data: RequestResponse = await res.json();

      if (!res.ok || data.success === false) {
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
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
;null as any as Actions;