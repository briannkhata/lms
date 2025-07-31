// @ts-nocheck
import { jwtDecode } from "jwt-decode";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

interface DecodedToken {
  sub: string;
  username: string;
  name: string;
  role: string;
  exp: number;
}

export const load = async ({ cookies }: Parameters<LayoutServerLoad>[0]) => {
  const token = cookies.get("token");
  if (!token) throw redirect(302, "/");

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      throw redirect(302, "/");
    }

    return { user: decoded };
  } catch (error) {
    throw redirect(302, "/");
  }
};
