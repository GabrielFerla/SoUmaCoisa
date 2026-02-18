export interface User {
  id: string;
  email: string;
  displayName: string;
  timezone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
