export interface WikiPage {
  id: string;
  title: string;
  content: string;
  related_pages: string[];
  last_edited_by: string;
  created_at: string;
}

export async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return (await res.json()) as T;
}
