export type AuthApiUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthApiUser;
};

export type SessionUser = {
  provider: "local" | "google" | "facebook";
  id?: string;
  name: string;
  email?: string;
  picture?: string;
};

const ACCESS_TOKEN_COOKIE = "mathuros_access_token";
const REFRESH_TOKEN_COOKIE = "mathuros_refresh_token";
const USER_SESSION_KEY = "mathuros_user";
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${Math.max(0, Math.floor(maxAge))}; SameSite=Lax${secure}`;
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

export function getUserSession(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(USER_SESSION_KEY);
  if (!value) return null;

  try {
    const user = JSON.parse(value) as Partial<SessionUser>;
    const validProvider = user.provider === "local" || user.provider === "google" || user.provider === "facebook";
    if (!validProvider || typeof user.name !== "string") return null;
    return user as SessionUser;
  } catch {
    window.sessionStorage.removeItem(USER_SESSION_KEY);
    return null;
  }
}

export function setUserSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(USER_SESSION_KEY);
}

export function setAuthSession({
  accessToken,
  refreshToken,
  expiresIn,
}: AuthSessionResponse): void {
  writeCookie(ACCESS_TOKEN_COOKIE, accessToken, expiresIn);
  writeCookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);
}

export function clearAuthSession(): void {
  writeCookie(ACCESS_TOKEN_COOKIE, "", 0);
  writeCookie(REFRESH_TOKEN_COOKIE, "", 0);
  clearUserSession();
}

