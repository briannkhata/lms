// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { postFormData } from "$lib/utils/apiPost";

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

export const load = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
  const token = cookies.get("token");
  const id = params.id;

  if (!token) {
    return { user: null };
  }

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
      title: formData.get("title")?.toString() || "",
      code: formData.get("code")?.toString() || "",
      content_type: formData.get("content_type")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      subject_id: Number(formData.get("subject_id")),
      grade_level_id: Number(formData.get("grade_level_id")),
      folder_id: Number(formData.get("folder_id")),
      cloudinary_url: formData.get("cloudinary_url"),
    };
    const postURL = `${BASE_URL}/private/lesson/update/${fields.id}`;

    const result = await postFormData({
      inputs: fields,
      method: "PUT",
      url: postURL,
      token,
      requiredFields: [
        "id",
        "title",
        "code",
        "content_type",
        "description",
        "subject_id",
        "grade_level_id",
        "folder_id",
        "cloudinary_url",
      ],
    });

    if (!result.success) {
      return fail(
        result.status,
        result.errors
          ? {
              errors: result.errors,
              values: fields,
            }
          : { message: result.message }
      );
    }

    return {
      type: "success",
      success: true,
      message: result.message,
    };
  },
};
;null as any as Actions;