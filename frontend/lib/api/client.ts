const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);

  // JSON request header
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Add JWT token from Auth.js session or localStorage
  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    let token = localStorage.getItem("prism_token");

    if (!token) {
      try {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        if (session?.accessToken) {
          token = session.accessToken;
        }
      } catch {
        // Fallback gracefully if session unavailable
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Try to read JSON response
  const data: unknown = await response
    .json()
    .catch(() => null);

  // Handle errors
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      errorMessage = data.message;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      errorMessage = data.error;
    }

    // Validation errors
    if (
      typeof data === "object" &&
      data !== null &&
      "errors" in data &&
      Array.isArray(data.errors)
    ) {
      const messages = data.errors
        .map((error: unknown) => {
          if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string"
          ) {
            return error.message;
          }

          return null;
        })
        .filter(
          (message): message is string =>
            message !== null
        );

      if (messages.length > 0) {
        errorMessage = messages.join(". ");
      }
    }

    throw new Error(errorMessage);
  }

  return data as T;
}

/**
 * GET
 */
export async function get<T>(
  endpoint: string
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "GET",
  });
}

/**
 * POST
 */
export async function post<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "POST",
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });
}

/**
 * PUT
 */
export async function put<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PUT",
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });
}

/**
 * PATCH
 */
export async function patch<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PATCH",
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });
}

/**
 * DELETE
 */
export async function del<T>(
  endpoint: string
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "DELETE",
  });
}

export { apiClient };