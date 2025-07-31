import type { PageServerLoad } from "./$types";
import { fetchData } from "$lib/utils/fetchData";
import type { Actions } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";

export interface Parcel {
  id: number;
  name: string;
  location: string;
  coordinates?: string;
  description?: string;
  parceltype?: string;
  o_name?: string;
  o_phone?: string;
  o_email?: string;
  o_address?: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  if (!token) {
    return { parcels: null };
  }

  try {
    const [parcels] = await Promise.all([
      fetchData<Parcel[]>(`http://127.0.0.1:8001/api/v1/parcels`, token),
    ]);

    return { parcels };
  } catch (error) {
    return { parcels: null };
  }
};

export const actions: Actions = {
  deleteRecord: async ({ request, cookies }) => {
    const formData = await request.formData();
    const parcelId = formData.get("parcelId")?.toString();

    if (!parcelId) {
      return {
        type: "failure",
        data: { message: "parcelId is required" },
      };
    }

    const token = cookies.get("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/v1/parcels/${parcelId}`,
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
