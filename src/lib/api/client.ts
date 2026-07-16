import type { ApiResponse } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const msg = (body as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(url, {
    ...rest,
    headers: {
      accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = await parseJson(response);

  if (!response.ok) {
    throw new ApiError(
      messageFromBody(parsed, `Request failed (${response.status})`),
      response.status,
      parsed,
    );
  }

  if (
    parsed &&
    typeof parsed === 'object' &&
    'success' in parsed &&
    'data' in parsed
  ) {
    const envelope = parsed as ApiResponse<T>;
    if (!envelope.success) {
      throw new ApiError(
        envelope.message || 'Request was not successful',
        envelope.status || response.status,
        envelope,
      );
    }
    return envelope.data;
  }

  return parsed as T;
}

/** Treat 404 envelopes as empty lists when listing resources. */
export async function apiRequestList<T>(
  url: string,
  options?: RequestOptions,
): Promise<T[]> {
  try {
    const data = await apiRequest<T[] | null>(url, options);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}
