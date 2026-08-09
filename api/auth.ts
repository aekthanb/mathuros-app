import { api } from "./client";
import type {
  AuthApiUser,
  AuthSessionResponse,
} from "../lib/auth/session";

export const loginWithGoogleRequest = async (params: {
  idToken: string;
}) => {
  const res = await api.post<AuthSessionResponse>("/auth/google", params);
  return res.data;
};

export const loginWithFacebookRequest = async (params: {
  accessToken: string;
}) => {
  const res = await api.post<AuthSessionResponse>("/auth/facebook", params);
  return res.data;
};

export const refreshTokenRequest = async (params: {
  refreshToken: string;
}) => {
  const res = await api.post<AuthSessionResponse>("/auth/refresh", params);
  return res.data;
};

export const logoutRequest = async (params: {
  refreshToken: string;
}) => {
  await api.post("/auth/logout", params);
};

export const getCurrentUserRequest = async () => {
  const res = await api.get<AuthApiUser>("/auth/me");
  return res.data;
};

