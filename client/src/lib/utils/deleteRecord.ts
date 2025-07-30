import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";

const BASE_URL = env.PUBLIC_API_BASE_URL;

type DeleteResponse = {
  success: boolean;
  msg?: string;
};

export async function deleteRecord({
  request,
  cookies,
  endpointPath,
  httpMethod = "PUT",
}: {
  request: Request;
  cookies: any;
  endpointPath: string;
  httpMethod?: "PUT";
}) {
  const token = cookies.get("token");
  const formData = await request.formData();
  const id = formData.get("id")?.toString();

  if (!id) {
    return fail(400, { errors: { id: "ID is missing." } });
  }

  try {
    const url = `${BASE_URL}/${endpointPath}/${id}`;
    const res = await fetch(url, {
      method: httpMethod,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data: DeleteResponse = await res.json();

    if (!res.ok || !data.success) {
      console.error("Delete failed:", data);
      return fail(400, {
        message: data.msg || "Delete failed.",
      });
    }

    return {
      type: "success",
      success: true,
      message: data.msg,
    };
  } catch (error) {
    console.error("Connection error:", error);
    return fail(500, { message: "Could not connect to the API" });
  }
}
