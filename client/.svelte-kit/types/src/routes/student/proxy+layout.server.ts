// @ts-nocheck
import { jwtDecode } from "jwt-decode";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";

export const load = async ({ cookies }: Parameters<LayoutServerLoad>[0]) => {
  const token = requireToken(cookies);

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.warn("JWT token has expired.");
      throw redirect(302, "/");
    }

    const user = {
      username: decoded.username,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      address: decoded.address,
      date_of_birth: decoded.date_of_birth,
      city: decoded.city,
      district: decoded.district,
      town: decoded.town,
      current_school: decoded.current_school,
      grade_level_id: decoded.grade_level_id,
      is_online: decoded.is_online,
      gender: decoded.gender,
      country: decoded.country,
      id: decoded.id,
      phone: decoded.phone,
    };
    return { user };
  } catch (err) {
    throw redirect(302, "/");
  }
};
