// @ts-nocheck
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";

import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  //phone: string;
  email: string;
  role: string;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);

  try {
    const [users] = await Promise.all([
      await fetchData<User>(`http://127.0.0.1:8001/api/v1/users`, token),
    ]);

    return {
      users,
    };
  } catch (error) {
    return { subscriptions: null };
  }
};

export const actions = {
  deleteRecord: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const formData = await request.formData();
    const userId = formData.get("userId")?.toString();

    if (!userId) {
      return {
        type: "failure",
        data: { message: "UserId is required" },
      };
    }

    const token = cookies.get("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          type: "failure",
          data: errorData,
        };
      }

      const result = await response.json();

      if ("success" in result && !result.success) {
        return {
          type: "failure",
          data: result,
        };
      }

      return {
        type: "success",
        data: result,
      };
    } catch (error) {
      return {
        type: "failure",
        data: {
          message: "An unexpected error occurred.",
        },
      };
    }
  },
};
;null as any as Actions;