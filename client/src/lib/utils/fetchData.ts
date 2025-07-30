// src/lib/utils/fetchData.ts

export class FetchDataError extends Error {
  status?: number;
  url?: string;
  constructor(message: string, status?: number, url?: string) {
    super(message);
    this.name = "FetchDataError";
    this.status = status;
    this.url = url;
  }
}

export async function fetchData<T>(url: string, token: string): Promise<T> {
  console.log(`[FetchData] Fetching from URL: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[FetchData] Response status: ${res.status}`);

    if (res.status === 404) {
      console.warn(`[FetchData] 404 Not Found for URL: ${url}`);
      throw new FetchDataError("No data found", 404, url);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error body");
      const errorMessage = `Failed to fetch ${url}: ${res.status} ${res.statusText} - ${text}`;
      console.error(`[FetchData] ${errorMessage}`);
      throw new FetchDataError(errorMessage, res.status, url);
    }

    const json = await res.json().catch(() => {
      throw new FetchDataError(
        "Failed to parse JSON response",
        res.status,
        url
      );
    });

    console.log(`[FetchData] Response received:`, json);

    if (!json?.data || typeof json.data !== "object") {
      throw new FetchDataError("Invalid response format", res.status, url);
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof FetchDataError) {
      console.error(`[FetchData] FetchDataError: ${error.message}`);
      throw error;
    }

    console.error(`[FetchData] Unexpected exception:`, error);
    throw new FetchDataError(
      "Unexpected error occurred during fetch",
      undefined,
      url
    );
  }
}
