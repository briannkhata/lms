import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Lesson {
  id: number;
  code?: string;
  title: string;
  content_type: string;
  description: string;
  subject_id: string;
  folder_id: string;
  grade_level_id: string;
  gradelevel?: GradeLevel;
  subject?: Subject;
  folder?: Folder;
}

interface GradeLevel {
  id: number;
  name?: string;
  description: string;
}
interface Folder {
  id: number;
  name?: string;
  description: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface LessonResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load: PageServerLoad = async ({ cookies, params }) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    return { user: null };
  }

  try {
    const [lesson] = await Promise.all([
      await fetchData<Lesson>(`${BASE_URL}/private/lesson/${id}`, token),
    ]);

    return {
      lesson,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");
    console.log("Token received:", token ? "[REDACTED]" : "None");

    if (!token) {
      console.warn("No token found in cookies.");
      return fail(401, { message: "Unauthorized: Token is missing." });
    }

    const formData = await request.formData();
    console.log("Form data received.");

    // Extract form values
    const fields = {
      id: formData.get("id")?.toString() || "",
      title: formData.get("title")?.toString() || "",
      code: formData.get("code")?.toString() || "",
      content_type: formData.get("content_type")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      subject_id: formData.get("subject_id")?.toString() || "",
      grade_level_id: formData.get("grade_level_id")?.toString() || "",
      cloudinary_url: formData.get("cloudinary_url"),
    };

    console.log("Extracted fields:", fields);

    // Validation
    const errors: Record<string, string> = {};

    if (!fields.id) errors.id = "ID is required.";
    if (!fields.code) errors.code = "Code is required.";
    if (!fields.title) errors.title = "Title is required.";
    if (!fields.content_type) errors.content_type = "Content type is required.";
    if (!fields.description) errors.description = "Description is required.";
    if (!fields.subject_id) errors.subject_id = "Subject is required.";
    if (!fields.cloudinary_url)
      errors.cloudinary_url = "Lesson URL is required.";

    if (!fields.grade_level_id)
      errors.grade_level_id = "Grade level is required.";

    if (Object.keys(errors).length > 0) {
      console.warn("Validation errors:", errors);
      return fail(400, {
        errors,
        values: fields,
      });
    }

    // Prepare payload without id (id is part of the URL)
    const payload = { ...fields };

    const UPDATE_URL = `${BASE_URL}/private/lesson/update/${fields.id}`;
    console.log("Sending PUT request to:", UPDATE_URL);
    console.log("Payload:", payload);

    try {
      const res = await fetch(UPDATE_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed response body:", text);
        return fail(res.status, {
          message: `Server error: ${res.statusText}`,
        });
      }

      const data: LessonResponse = await res.json();
      console.log("Response data:", data);

      if (!data.success) {
        console.warn("API indicated failure:", data.msg);
        return fail(400, {
          message: data.msg || "Operation failed.",
        });
      }

      console.log("Lesson updated successfully:", data.msg);
      return {
        type: "success",
        success: true,
        message: data.msg,
      };
    } catch (err) {
      console.error("Request error:", err);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
