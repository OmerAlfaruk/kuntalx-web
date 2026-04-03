import axios, { type AxiosInstance, type AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api/v1';

export const getMediaUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;

  // Strip /api/v1 from the end of the base URL to get the root
  const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

  // Ensure the path doesn't have a double slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${rootUrl}${cleanPath}`;
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            try {
              // We use a different axios instance or direct call to avoid interceptor loop
              const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken
              });

              const { access_token, refresh_token: new_refresh_token } = refreshResponse.data;

              localStorage.setItem('authToken', access_token);
              localStorage.setItem('refreshToken', new_refresh_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              localStorage.clear();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            localStorage.clear();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.client.get(url, params ? { params } : undefined).then(response => response.data);
  }

  public post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then(response => response.data);
  }

  public put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put(url, data, config).then(response => response.data);
  }

  public patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch(url, data, config).then(response => response.data);
  }

  public delete<T>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config).then(response => response.data);
  }
}

export const apiClient = new ApiClient();