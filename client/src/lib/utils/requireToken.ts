import { redirect, type Cookies } from "@sveltejs/kit";

export function requireToken(cookies: Cookies, p0?: string): string {
  const token = cookies.get("token");

  if (!token) {
    console.warn("No auth token found");
    throw redirect(302, "/");
  }

  return token;
}
