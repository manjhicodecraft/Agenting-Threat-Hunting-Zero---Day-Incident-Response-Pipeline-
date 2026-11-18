import { env } from '@/config/env';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Unable to reach the analysis backend. Check that the API server is running.', 0);
  }

  if (!response.ok) {
    throw new ApiError(`The backend responded with status ${response.status}.`, response.status);
  }

  return (await response.json()) as T;
}
