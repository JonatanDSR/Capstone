export type UserRole = 'INDIVIDUAL' | 'BUSINESS' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  rut: string;
  password: string;
  businessName?: string;
  businessAddress?: string;
};

export type OrderStatus = 'RECEIVED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export type Order = {
  id: number;
  name: string;
  quantity: number;
  description: string;
  address: string;
  height: number;
  length: number;
  width: number;
  weight: number;
  status: OrderStatus;
  createdAt: Date;
  userId: string;
  user?: User;
};

export type ProfileFormData = {
  name: string;
  email: string;
  rut: string;
  businessName?: string;
  businessAddress?: string;
};

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};