const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

type ApiEnvelope<T> = { data: T };

export type ProblemDetail = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly problem: ProblemDetail;

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title);
    this.name = "ApiError";
    this.status = problem.status;
    this.code = problem.code;
    this.problem = problem;
  }
}

export function getFieldError(error: Error, field: string): string | undefined {
  return error instanceof ApiError ? error.problem.fieldErrors?.[field] : undefined
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    window.location.origin,
  );
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function readProblem(response: Response): Promise<ProblemDetail> {
  const fallback: ProblemDetail = {
    type: "about:blank",
    title: response.statusText || "Request failed",
    status: response.status,
    detail: "요청을 처리하지 못했습니다.",
  };

  try {
    const problem = (await response.json()) as Partial<ProblemDetail>;
    return {
      ...fallback,
      ...problem,
      status: problem.status ?? response.status,
    };
  } catch {
    return fallback;
  }
}

export async function apiRequest<T>(
  path: string,
  { body, query, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json, application/problem+json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) throw new ApiError(await readProblem(response));
  if (response.status === 204) return undefined as T;

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}

export const api = {
  get: <T>(path: string, query?: ApiRequestOptions["query"]) =>
    apiRequest<T>(path, { query }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body }),
  delete: <T = void>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
