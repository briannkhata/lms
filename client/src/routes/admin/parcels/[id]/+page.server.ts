import { requireToken } from "$lib/utils/requireToken";
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

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

interface ParcelResponse {
  success: boolean;
  message: string;
  token?: string;
}
async function fetchSingleParcel(token: string, id: string): Promise<Parcel> {
  const res = await fetch(`http://127.0.0.1:8001/api/v1/parcels/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch parcel: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (!json?.data || typeof json.data !== "object") {
    throw new Error("Invalid parcel response format");
  }

  return json.data;
}

export const load: ServerLoad = async ({ cookies, params }) => {
  const token = requireToken(cookies);
  const id = params.id;

  if (!token) {
    console.warn("No auth token found");
    return { parcel: null };
  }

  try {
    const parcel = await fetchSingleParcel(token, id);
    return { parcel };
  } catch (error) {
    console.error("Failed to load parcel:", error);
    return fail(500, {
      message: "Failed to load parcel",
    });
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = requireToken(cookies);

    const formData = await request.formData();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const coordinates = formData.get("coordinates")?.toString().trim() ?? "";
    const description = formData.get("description")?.toString().trim() ?? "";
    const parceltype = formData.get("parceltype")?.toString().trim() ?? "";
    const o_name = formData.get("o_name")?.toString().trim() ?? "";
    const o_phone = formData.get("o_phone")?.toString().trim() ?? "";
    const o_email = formData.get("o_email")?.toString().trim() ?? "";
    const o_address = formData.get("o_address")?.toString().trim() ?? "";

    const errors: Record<string, string> = {};

    if (!name) errors.name = "Name is required.";
    if (!location) errors.location = "Location is required.";
    if (!coordinates) errors.coordinates = "Coordinates are required.";
    if (!description) errors.description = "Description is required.";
    if (!parceltype) errors.parceltype = "Parcel type is required.";
    if (!o_name) errors.o_name = "Owner name is required.";
    if (!o_phone) errors.o_phone = "Owner phone is required.";
    if (!o_email) errors.o_email = "Owner email is required.";
    if (!o_address) errors.o_address = "Owner address is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const res = await fetch(`http://127.0.0.1:8001/api/v1/parcels/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          coordinates,
          description,
          parceltype,
          o_name,
          o_phone,
          o_email,
          o_address,
        }),
      });

      const data: ParcelResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Updating parcel failed:", data);
        return fail(400, {
          message: data.message || "Updating parcel failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Connection error:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
