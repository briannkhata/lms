// @ts-nocheck
import { jwtDecode } from "jwt-decode";
import type { PageServerLoad } from "./$types";

interface DecodedToken {
  sub: string;
  username: string;
  name: string;
  role: string;
  exp: number;
}

export const load = async ({ cookies }: Parameters<PageServerLoad>[0]) => {
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

// export const actions: Actions = {
//   logout: async ({ cookies, fetch }) => {
//     const token = cookies.get("token");

//     if (token) {
//       try {
//         await fetch(LOGOUT_URL, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } catch (err) {
//         console.error("Failed to notify server:", err);
//       }
//     }

//     cookies.delete("token", { path: "/" });
//     throw redirect(302, "/");
//   },
// };
