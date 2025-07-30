// @ts-nocheck
import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { postFormData } from "$lib/utils/apiPost";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const CREATE_URL = `${BASE_URL}/private/lesson/`;
const SUBJECTS_URL = `${BASE_URL}/private/subject`;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;
const FOLDER_URL = `${BASE_URL}/private/folder/`;

interface GradeLevel {
  id: number;
  name: string;
  description?: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface Folder {
  id: number;
  name: string;
  description?: string;
}

interface LessonResponse {
  success: boolean;
  msg: string;
  token?: string;
}

export const load = async ({ cookies }: Parameters<ServerLoad>[0]) => {
  const token = requireToken(cookies);

  try {
    const [gradelevels, subjects, folders] = await Promise.all([
      await fetchData<GradeLevel>(GRADELEVELS_URL, token),
      await fetchData<Subject>(SUBJECTS_URL, token),
      await fetchData<Folder>(FOLDER_URL, token),
    ]);

    return {
      gradelevels,
      subjects,
      folders,
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
      title: formData.get("title")?.toString() || "",
      code: formData.get("code")?.toString() || "",
      content_type: formData.get("content_type")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      subject_id: parseInt(formData.get("subject_id")?.toString() || "", 10),
      grade_level_id: parseInt(
        formData.get("grade_level_id")?.toString() || "",
        10
      ),
      folder_id: parseInt(formData.get("folder_id")?.toString() || "", 10),
      cloudinary_url: formData.get("cloudinary_url")?.toString() || "",
    };

    const errors: Record<string, string> = {};

    if (!fields.title) errors.title = "Title is required.";
    if (!fields.code) errors.code = "Code is required.";
    if (!fields.content_type) errors.content_type = "Content type is required.";
    if (!fields.description) errors.description = "Description is required.";
    if (!fields.subject_id) errors.subject_id = "Subject ID is required.";
    if (!fields.grade_level_id)
      errors.grade_level_id = "Grade level ID is required.";
    if (!fields.folder_id) errors.folder_id = "Folder ID is required.";
    if (!fields.cloudinary_url)
      errors.cloudinary_url = "Cloudinary URL is required.";

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }

    try {
      const res = await fetch(`${BASE_URL}/private/lesson/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      const data: LessonResponse = await res.json();

      if (!res.ok || data.success === false) {
        console.error("Lesson creation failed:", data);
        return fail(400, {
          message: data.msg || "Lesson creation failed.",
        });
      }

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