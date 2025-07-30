// @ts-nocheck
import type { PageServerLoad } from "/$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import type { Actions } from "@sveltejs/kit";
import { deleteRecord } from "$lib/utils/deleteRecord";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const LESSONS_URL = `${BASE_URL}/private/lesson/`;

interface GradeLevel {
  id: number;
  name?: string;
}
interface Folder {
  id: number;
  name?: string;
}
interface Subject {
  id: number;
  name?: string;
  code?: string;
}

interface Lesson {
  id: number;
  code?: string;
  title: string;
  content_type: string;
  description: string;
  subject_id: string;
  subject?: Subject;
  grade_level_id: string;
  gradelevel?: GradeLevel;
  folder_id: string;
  folder?: Folder;
  created_by?: number;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const [lessons] = await Promise.all([
      await fetchData<Lesson>(LESSONS_URL, token),
    ]);

    return {
      lessons,
    };
  } catch (error) {
    console.error("Error in load function:", error);
    return { user: null };
  }
};

export const actions = {
  deleteRecord: async ({ request, cookies }: import('./$types').RequestEvent) => {
    try {
      const result = await deleteRecord({
        request,
        cookies,
        endpointPath: "private/lesson/delete",
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
      console.error("Delete failed:", error);
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