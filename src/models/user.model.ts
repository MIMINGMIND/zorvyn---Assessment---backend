export enum Role {
  VIEWER = 'VIEWER',
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: string;
  email: string;
  password?: string; // Hashed password
  role: Role;
  status: Status;
  created_at: string;
}

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}
