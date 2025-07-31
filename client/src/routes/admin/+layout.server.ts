import { jwtDecode } from "jwt-decode";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireToken } from "$lib/utils/requireToken";
import { fetchData } from "$lib/utils/fetchData";

export interface Parcel {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
}

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = requireToken(cookies);

  try {
    const [parcels, users] = await Promise.all([
      fetchData<Parcel[]>(`http://127.0.0.1:8001/api/v1/parcels`, token),
      fetchData<User[]>(`http://127.0.0.1:8001/api/v1/users`, token),
    ]);

    return { parcels, users };
  } catch (error) {
    return { parcels: [], user: [] };
  }
};
