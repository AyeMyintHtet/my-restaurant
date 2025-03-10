const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchApi(
  endpoint: string,
  options?: RequestInit,
): Promise<any> {
  const url = `${baseUrl}${endpoint}`;
console.log('rrrrrrl',url)
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    console.log('ressss',await response.json())
    const status = response.status >= 200 && response.status < 300 ? 'success' : 'error';
    return {status,data: response};
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}