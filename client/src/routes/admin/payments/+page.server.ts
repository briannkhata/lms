import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";
import { fetchData } from "$lib/utils/fetchData";

const BASE_URL = env.PUBLIC_API_BASE_URL;
const PAYMENTS_URL = `${BASE_URL}/private/payment`;

interface Payment {
  id: number;
  payment_mode: string;
  amount: number;
  subscription_id: number;
  subscription?: Subscription;
  plan_id: number;
  plan?: Plan;
  created_by?: number;
  deleted?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface Subscription {
  id: number;
  name: string;
}
interface Plan {
  id: number;
  title?: string;
  duration: string;
  price: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return { user: null };
  }

  try {
    const [payments] = await Promise.all([
      fetchData<Payment>(PAYMENTS_URL, token).catch((err) => {
        console.warn("GETTING PAYMENTS failed:", err);
        return [];
      }),
    ]);

    return {
      payments,
    };
  } catch (error) {
    console.error("Fatal error in load function:", error);
    return { user: null };
  }
};
