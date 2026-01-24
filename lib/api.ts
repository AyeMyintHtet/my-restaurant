const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

export async function fetchApi(
  endpoint: string,
  options?: RequestInit,
): Promise<any> {
  const url = `${baseUrl}${endpoint}`;
  try {

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      ...options,
      headers: {
        ...(endpoint.startsWith('/api/image') && options?.method === 'POST' ? {} : { 'Content-Type': 'application/json' }),
        ...options?.headers,
      },
    });
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}