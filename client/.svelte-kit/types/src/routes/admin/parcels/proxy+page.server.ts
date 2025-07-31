// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { fetchData } from "$lib/utils/fetchData";
import { deleteRecord } from "$lib/utils/deleteRecord";
import type { Actions } from "@sveltejs/kit";

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

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = cookies.get("token");

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

export const actions = {
  deleteRecord: async ({ request, cookies }: import('./$types').RequestEvent) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "/parcel/api/v1/delete",
      });

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