// utils/api.ts
export async function postWithAuth<T>(
  url: string,
  token: string,
  body: Record<string, any>
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (!json?.success) {
    throw new Error(json.msg || "Unknown error during POST");
  }

  return json as T;
}

export async function deleteWithAuth<T>(
  url: string,
  token: string
): Promise<T> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`DELETE failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (!json?.success) {
    throw new Error(json.msg || "Unknown error during DELETE");
  }

  return json as T;
}
