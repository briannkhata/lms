// @ts-nocheck
import type { LayoutLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchDataFront";

const GRADE_LEVELS_URL = `${env.PUBLIC_API_BASE_URL}/front/gradelevels`;

export const load = async () => {
  try {
    const gradelevels = await fetchData(GRADE_LEVELS_URL);
    return { gradelevels };
  } catch (err) {
    console.error("Failed to load gradelevels in layout:", err);
    return { gradelevels: [] };
  }
};
;null as any as LayoutLoad;