// @ts-nocheck
import { jwtDecode } from "jwt-decode";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { redirect, type Actions } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";

interface DecodedToken {
  username?: string;
  exp?: number;
  email?: string;
}

const BASE_URL = env.PUBLIC_API_BASE_URL;

const PLANS_URL = `${BASE_URL}/private/plan`;
const GRADELEVELS_URL = `${BASE_URL}/private/gradelevel`;
const STUDENTS_URL = `${BASE_URL}/private/user/students/`;
const TEACHERS_URL = `${BASE_URL}/private/user/teachers/`;

const LOGGEDIN_STUDENTS_URL = `${BASE_URL}/private/user/students/online/`;
const SUBJECTS_URL = `${BASE_URL}/private/subject/`;

const LESSONS_URL = `${BASE_URL}/private/lesson/`;
const ACTIVESUBS_URL = `${BASE_URL}/private/subscription/`;
const EXPIRINGSUBS_URL = `${BASE_URL}/private/subscription/`;
const EXPIREDSUBS_URL = `${BASE_URL}/private/subscription/`;
const LOGOUT_URL = `${BASE_URL}/private/user/logout/`;

interface GradeLevel {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  title: string;
}

interface Folder {
  id: number;
  name: string;
  description: string;
  subject_id: number;
}
interface User {
  id: number;
  role: string;
  is_online: number;
}
interface Lesson {
  id: number;
}

interface Subject {
  id: number;
}
interface Subscription {
  id: number;
  status: number;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  const token = requireToken(cookies);
  const decoded = jwtDecode<{ grade_level_id: number }>(token);

  const grade_level_id = decoded.grade_level_id;
  if (!grade_level_id) {
    console.warn("[FoldersLoader] Missing grade_level_id in token");
    return { folders: [] };
  }

  try {
    const folders = await fetchData<Folder[]>(
      `${BASE_URL}/private/folder/student/${grade_level_id}`,
      token
    );

    console.log("[FoldersLoader] Folders loaded:", folders.length);
    return { folders };
  } catch (error) {
    console.error("[FoldersLoader] Error loading folders:", error);
    return { folders: [] }; // consistent return shape
  }
};

export const actions = {
  logout: async ({ cookies, fetch }: import('./$types').RequestEvent) => {
    const token = requireToken(cookies);

    if (token) {
      try {
        await fetch(LOGOUT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to notify server:", err);
      }
    }

    cookies.delete("token", { path: "/" });
    throw redirect(302, "/");
  },
};
;null as any as Actions;