import { z } from 'zod';
import { validateRut } from '../utils/rut';

export const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  rut: z.string().refine(validateRut, 'RUT inválido'),
});

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una letra y un número'
    ),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});