import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchDataFront";
import type { Load } from "@sveltejs/kit";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface GradeLevel {
  id: number;
  code: string;
  name: string;
}

interface Lesson {
  id: number;
  code?: string;
  title: string;
  content_type: string;
  description: string;
  subject?: Subject;
  gradelevel?: GradeLevel;
}

export const load: Load = async () => {
  try {
    const [lessons] = await Promise.all([
      await fetchData<Lesson>(`${BASE_URL}/front/lessons/`),
    ]);

    return {
      lessons,
    };
  } catch (error) {
    console.error("Error in load lessons in home page:", error);
    return { lessons: null, gradelevels: null };
  }
};
