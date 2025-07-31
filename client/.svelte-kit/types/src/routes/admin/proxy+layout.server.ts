// @ts-nocheck
import { jwtDecode } from "jwt-decode";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { fetchData } from "$lib/utils/fetchData";

export interface Parcel {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
}

interface DecodedToken {
  sub: string;
  username: string;
  name: string;
  role: string;
  exp: number;
}

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

    const [parcels, users] = await Promise.all([
      fetchData<Parcel[]>(`http://127.0.0.1:8001/api/v1/parcels`, token),
      fetchData<User[]>(`http://127.0.0.1:8001/api/v1/users`, token),
    ]);

    return { parcels, users, user: decoded };
  } catch (error) {
    return { parcels: [], users: [], user: null };
  }
};
