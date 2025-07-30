import { jwtDecode } from "jwt-decode";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { redirect, type Actions } from "@sveltejs/kit";

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

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const user = jwtDecode<DecodedToken>(token);

    const now = Math.floor(Date.now() / 1000);
    if (user.exp && user.exp < now) {
      console.warn("Token expired");
      return { user: null };
    }

    const [
      gradeLevels,
      plans,
      students,
      teachers,
      lessons,
      subjects,
      subscriptions,
      expiredsubscriptions,
      expiringsubscriptions,
      loggedinStudents,
    ] = await Promise.all([
      fetchData<GradeLevel>(GRADELEVELS_URL, token).catch((err) => {
        console.warn("GRADELEVELS failed:", err);
        return [];
      }),
      fetchData<Plan>(PLANS_URL, token).catch((err) => {
        console.warn("PLANS failed:", err);
        return [];
      }),
      fetchData<User>(STUDENTS_URL, token).catch((err) => {
        console.warn("STUDENTS failed:", err);
        return [];
      }),
      fetchData<User>(TEACHERS_URL, token).catch((err) => {
        console.warn("STUDENTS failed:", err);
        return [];
      }),
      fetchData<Lesson>(LESSONS_URL, token).catch((err) => {
        console.warn("LESSONS failed:", err);
        return [];
      }),
      fetchData<Subject>(SUBJECTS_URL, token).catch((err) => {
        console.warn("SUBJECTS failed:", err);
        return [];
      }),
      fetchData<Subscription>(ACTIVESUBS_URL, token).catch((err) => {
        console.warn("ACTIVESUBS failed:", err);
        return [];
      }),
      fetchData<Subscription>(EXPIREDSUBS_URL, token).catch((err) => {
        console.warn("EXPIREDSUBS failed:", err);
        return [];
      }),
      fetchData<Subscription>(EXPIRINGSUBS_URL, token).catch((err) => {
        console.warn("EXPIRINGSUBS failed:", err);
        return [];
      }),
      fetchData<User>(LOGGEDIN_STUDENTS_URL, token).catch((err) => {
        console.warn("LOGGEDIN_STUDENTS failed:", err);
        return [];
      }),
    ]);

    return {
      user,
      gradeLevels,
      plans,
      students,
      teachers,
      lessons,
      subjects,
      subscriptions,
      expiredsubscriptions,
      expiringsubscriptions,
      loggedinStudents,
    };
  } catch (error) {
    console.error("Fatal error in load function:", error);
    return { user: null };
  }
};

export const actions: Actions = {
  logout: async ({ cookies, fetch }) => {
    const token = cookies.get("token");

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
