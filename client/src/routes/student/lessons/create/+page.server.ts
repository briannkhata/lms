import type { Actions, ServerLoad } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { postFormData } from "$lib/utils/apiPost";

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

export const load: ServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

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

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const token = cookies.get("token");
    if (!token) {
      return fail(401, { message: "Unauthorized: Token is missing." });
    }

    const formData = await request.formData();

    const fields = {
      title: formData.get("title")?.toString() || "",
      code: formData.get("code")?.toString() || "",
      content_type: formData.get("content_type")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      subject_id: parseInt(formData.get("subject_id").toString() || "0", 10),
      grade_level_id: parseInt(
        formData.get("grade_level_id").toString() || "0",
        10
      ),
      folder_id: parseInt(formData.get("folder_id").toString() || "0", 10),
      cloudinary_url: formData.get("cloudinary_url"),
    };
    const postURL = `${BASE_URL}/private/lesson/`;

    const result = await postFormData({
      inputs: fields,
      method: "POST",
      url: postURL,
      token,
      requiredFields: [
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
