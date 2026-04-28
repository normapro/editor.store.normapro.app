const EDITOR_TOKEN_KEY = 'editor_auth_token';

type JwtPayload = {
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isEditorTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp || !Number.isFinite(payload.exp)) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

export function getEditorToken(): string | null {
  const token = localStorage.getItem(EDITOR_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isEditorTokenExpired(token)) {
    clearEditorToken();
    return null;
  }

  return token;
}

export function setEditorToken(token: string): void {
  localStorage.setItem(EDITOR_TOKEN_KEY, token);
}

export function clearEditorToken(): void {
  localStorage.removeItem(EDITOR_TOKEN_KEY);
}

export function isEditorAuthenticated(): boolean {
  return Boolean(getEditorToken());
}
