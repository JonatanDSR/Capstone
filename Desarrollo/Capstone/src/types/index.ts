import { z } from 'zod';
import { registerSchema } from '../schemas/register';

export type UserRole = 'INDIVIDUAL' | 'BUSINESS' | 'ADMIN';

export type BusinessRepresentative = {
  name: string;
  phone: string;
  position: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  rut: string;
  phone: string;
  password: string;
  businessName?: string;
  businessAddress?: string;
  businessRepresentative?: BusinessRepresentative;
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
  phone: string;
  businessName?: string;
  businessAddress?: string;
  businessRepresentative?: BusinessRepresentative;
};

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type RegisterFormData = z.infer<typeof registerSchema>;