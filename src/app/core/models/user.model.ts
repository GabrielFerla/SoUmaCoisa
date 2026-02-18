export interface User {
  id: string;
  email: string;
  displayName: string;
  timezone: string;
}

/** API pode retornar snake_case; normaliza para o nosso User */
export function normalizeUser(raw: unknown): User {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o?.['id'] ?? ''),
    email: String(o?.['email'] ?? ''),
    displayName: String(o?.['displayName'] ?? o?.['display_name'] ?? ''),
    timezone: String(o?.['timezone'] ?? ''),
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
