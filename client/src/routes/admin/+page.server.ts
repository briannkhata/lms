import { jwtDecode } from "jwt-decode";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";

interface DecodedToken {
  sub: string;
  username: string;
  name: string;
  role: string;
  exp: number;
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
      console.warn("JWT token has expired.");
      return { user: null };
    }

    return { user };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { user: null };
  }
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    const token = cookies.get("token");

    cookies.delete("token", { path: "/" });
    throw redirect(302, "/");
  },
};
