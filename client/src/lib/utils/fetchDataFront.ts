// src/lib/fetchData.ts

export async function fetchData<T>(url: string): Promise<T[]> {
  console.log(`[fetchData] Fetching data from: ${url}`);

  try {
    const res = await fetch(url);
    console.log(`[fetchData] Response status: ${res.status}`);

    if (res.status === 404) {
      console.warn(`[fetchData] Resource not found at: ${url}`);
      return [];
    }

    if (!res.ok) {
      console.error(
        `[fetchData] Failed to fetch from ${url}: ${res.status} ${res.statusText}`
      );
      throw new Error(
        `Failed to fetch from ${url}: ${res.status} ${res.statusText}`
      );
    }

    const json = await res.json();
    console.log(`[fetchData] Response JSON received`, json);

    const data = Array.isArray(json?.data) ? json.data : [];
    console.log(`[fetchData] Parsed data array with length: ${data.length}`);
    return data;
  } catch (err) {
    console.error(`[fetchData] Error fetching data from ${url}`, err);
    throw err;
  }
}
