const EDITOR_TOKEN_KEY = 'editor_auth_token';

export function getEditorToken(): string | null {
  return localStorage.getItem(EDITOR_TOKEN_KEY);
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
