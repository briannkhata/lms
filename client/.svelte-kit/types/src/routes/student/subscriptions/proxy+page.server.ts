// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";
import { requireToken } from "$lib/utils/requireToken";
import { jwtDecode } from "jwt-decode";

const BASE_URL = env.PUBLIC_API_BASE_URL;

interface Plan {
  id: number;
  title: string;
  duration: number;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  plan_id: number;
  plan?: Plan;
  user_id: number;
  status: number;
  created_by?: number;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
  try {
    const token = requireToken(cookies);
    const decoded = jwtDecode<{ userId: string }>(token);
    const userID = decoded.userId;

    const subscriptions = await fetchData<Subscription>(
      `${BASE_URL}/private/subscription/student/${userID}`,
      token
    );
    console.log("[SubscriptionLoader] Subscriptions loaded:", subscriptions);
    return { subscriptions };
  } catch (error) {
    console.error("[SubscriptionLoader] Failed to load subscriptions:", error);
    return { subscriptions: null };
  }
};
