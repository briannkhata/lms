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

    const parcel_id = formData.get("parcel_id")?.toString() || "";
    const image = formData.get("image");

    const errors: Record<string, string> = {};

    if (!image || !(image instanceof File) || image.size === 0) {
      errors.image = "Image is required.";
    }

    if (!parcel_id) {
      errors.parcel_id = "Parcel ID is required.";
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const apiFormData = new FormData();
      apiFormData.append("parcel_id", parcel_id);
      apiFormData.append("image", image);

      const res = await fetch(`http://127.0.0.1:8001/api/v1/parcel-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: apiFormData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        return fail(res.status, {
          message: data.message || "Failed to upload image.",
        });
      }

      return {
        type: "success",
        success: true,
        message: "Image uploaded successfully.",
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return fail(500, {
        message: "Could not connect to the API",
      });
    }
  },
};
