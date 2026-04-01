/**
 * Base API Wrapper
 * @description Unified handling of request headers, authentication tokens, and error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

/**
 * Request configuration interface
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * API error class
 */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(status: number, message: string, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Base fetch wrapper
 * @param endpoint - API endpoint
 * @param options - Request configuration
 * @returns Promise<T>
 */
async function request<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Get authentication token
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Error handling
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
        code: 'NETWORK_ERROR',
      }));
      throw new ApiError(
        response.status,
        error.message || `HTTP error! status: ${response.status}`,
        error.code,
        error.details
      );
    }

    // Handle empty response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error or other exceptions
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * API method collection
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
