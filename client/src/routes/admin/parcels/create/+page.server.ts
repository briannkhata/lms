import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

interface ParcelResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");

    const formData = await request.formData();
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
      const res = await fetch(`http://127.0.0.1:8001/api/v1/parcels`, {
        method: "POST",
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
        console.error("Creating parcel failed:", data);
        return fail(res.status, {
          message: data.message || "Parcel creation failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("API connection error:", error);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
