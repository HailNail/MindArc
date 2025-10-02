export type User = {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

export type UserInfo = {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  token?: string;
};

export type AuthResponse = {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  userId: string;
  username?: string;
  email?: string;
  isAdmin?: boolean;
};
