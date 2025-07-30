// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { postFormData } from "$lib/utils/apiPost";
import { requireToken } from "$lib/utils/requireToken";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const SUBJECTS_URL = `${BASE_URL}/private/subject`;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;
const FOLDER_URL = `${BASE_URL}/private/folder/`;

interface Lesson {
  id: number;
  code?: string;
  title: string;
  content_type: string;
  description: string;
  subject_id: string;
  grade_level_id: string;
  folder_id: number;
  created_by?: number;
}

interface GradeLevel {
  id: number;
  name?: string;
  description: string;
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

export const load = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const id = params.id;

  try {
    const [gradelevels, subjects, lesson, folders] = await Promise.all([
      await fetchData<GradeLevel>(GRADELEVELS_URL, token),
      await fetchData<Subject>(SUBJECTS_URL, token),
      await fetchData<Lesson>(`${BASE_URL}/private/lesson/${id}`, token),
      await fetchData<Folder>(FOLDER_URL, token),
    ]);

    return {
      gradelevels,
      subjects,
      lesson,
      folders,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const token = cookies.get("token");
    if (!token) {
      return fail(401, { message: "Unauthorized: Token is missing." });
    }

    const formData = await request.formData();

    const fields = {
      id: Number(formData.get("id")),
      title: formData.get("title")?.toString().trim() || "",
      code: formData.get("code")?.toString().trim() || "",
      content_type: formData.get("content_type")?.toString().trim() || "",
      description: formData.get("description")?.toString().trim() || "",
      subject_id: Number(formData.get("subject_id")),
      grade_level_id: Number(formData.get("grade_level_id")),
      folder_id: Number(formData.get("folder_id")),
      cloudinary_url: formData.get("cloudinary_url")?.toString().trim() || "",
    };

    const requiredFields = [
      "id",
      "title",
      "code",
      "content_type",
      "description",
      "subject_id",
      "grade_level_id",
      "folder_id",
      "cloudinary_url",
    ];

    const errors: Record<string, string> = {};
    for (const key of requiredFields) {
      const value = fields[key as keyof typeof fields];
      if (typeof value === "string" ? !value : isNaN(Number(value))) {
        errors[key] = `${key.replace(/_/g, " ")} is required.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors, values: fields });
    }

    try {
      const response = await fetch(
        `${BASE_URL}/private/lesson/update/${fields.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );

      const result: LessonResponse = await response.json();

      if (!response.ok || result.success === false) {
        console.error("[LessonUpdate] API failed:", result);
        return fail(400, {
          message: result.message || "Lesson update failed.",
        });
      }

      return {
        type: "success",
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error("[LessonUpdate] Connection error:", error);
      return fail(500, {
        message: "Could not connect to the API.",
      });
    }
  },
};
;null as any as Actions;