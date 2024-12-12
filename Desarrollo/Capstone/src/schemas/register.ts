import { z } from 'zod';
import { validateRut } from '../utils/rut';
import { validateChileanPhone } from '../utils/validation';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una letra y un número'
    ),
  confirmPassword: z.string(),
  role: z.enum(['INDIVIDUAL', 'BUSINESS', 'ADMIN']),
  // Common fields
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  rut: z.string().refine(validateRut, 'RUT inválido'),
  phone: z.string().refine(validateChileanPhone, 'Formato válido: +569XXXXXXXX'),
  // Business fields
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessRepresentative: z.object({
    name: z.string(),
    phone: z.string().refine(validateChileanPhone, 'Formato válido: +569XXXXXXXX'),
    position: z.string(),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'BUSINESS') {
    return data.businessName && 
           data.businessAddress && 
           data.businessRepresentative?.name &&
           data.businessRepresentative?.phone &&
           data.businessRepresentative?.position;
  }
  return true;
}, {
  message: "Todos los campos de empresa son requeridos",
  path: ["businessName"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;