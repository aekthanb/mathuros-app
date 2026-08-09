import axios, { type AxiosError } from "axios";
import { getAccessToken } from "../lib/auth/session";

export class ApiError<TData = unknown> extends Error {
  readonly status?: number;
  readonly data?: TData;
  readonly originalError: AxiosError<TData>;

  constructor(message: string, error: AxiosError<TData>) {
    super(message);
    this.name = "ApiError";
    this.status = error.response?.status;
    this.data = error.response?.data;
    this.originalError = error;
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";

    return Promise.reject(new ApiError(message, error));
  },
);

