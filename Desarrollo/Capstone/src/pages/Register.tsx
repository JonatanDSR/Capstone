import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { validateRut, formatRut } from '../utils/rut';
import { validateChileanPhone, formatChileanPhone } from '../utils/validation';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import type { UserRole } from '../types';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

const registerSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una letra y un número'
    ),
  confirmPassword: z.string(),
  role: z.enum(['INDIVIDUAL', 'BUSINESS', 'ADMIN']),
  // Business fields
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  rut: z.string().refine(validateRut, 'RUT inválido'),
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

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const { addUser, findUserByEmail, findUserByRut, users } = useAuthStore();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('INDIVIDUAL');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'INDIVIDUAL'
    }
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setValue('rut', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatChileanPhone(e.target.value);
    setValue('businessRepresentative.phone', formatted);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = (data: RegisterFormData) => {
    try {
      const existingUserByEmail = findUserByEmail(data.email);
      if (existingUserByEmail) {
        setError('email', { message: 'El correo electrónico ya está registrado' });
        return;
      }

      const existingUserByRut = findUserByRut(data.rut);
      if (existingUserByRut) {
        setError('rut', { message: 'El RUT ya está registrado' });
        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        ...data,
      };

      addUser(newUser);
      alert('Cuenta creada exitosamente');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('root', { 
        message: 'Error al crear la cuenta. Por favor intente nuevamente.' 
      });
    }
  };

  // Verificar si hay usuarios registrados
  const isFirstUser = users.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img 
              src="/setralog-logo.png" 
              alt="SetraLog" 
              className="h-20"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-700">
            {isFirstUser ? 'Crear Cuenta de Administrador' : 'Crear Cuenta'}
          </h2>
          {isFirstUser && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Esta será la primera cuenta del sistema y tendrá privilegios de administrador.
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {selectedRole === 'BUSINESS' ? (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Datos de la Empresa</h3>
                
                <FormInput
                  label="Nombre Completo"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <FormInput
                  label="RUT"
                  {...register('rut')}
                  onChange={handleRutChange}
                  placeholder="12.345.678-9"
                  error={errors.rut?.message}
                />

                <FormInput
                  label="Razón Social"
                  {...register('businessName')}
                  error={errors.businessName?.message}
                  placeholder="Nombre legal de la empresa"
                />

                <FormInput
                  label="Dirección de la Empresa"
                  {...register('businessAddress')}
                  error={errors.businessAddress?.message}
                  placeholder="Dirección comercial"
                />

                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <h4 className="text-md font-medium text-gray-900">Representante Legal</h4>
                  
                  <FormInput
                    label="Nombre del Representante"
                    {...register('businessRepresentative.name')}
                    error={errors.businessRepresentative?.name?.message}
                  />

                  <FormInput
                    label="Teléfono de Contacto"
                    {...register('businessRepresentative.phone')}
                    onChange={handlePhoneChange}
                    placeholder="+56912345678"
                    error={errors.businessRepresentative?.phone?.message}
                  />

                  <FormInput
                    label="Cargo"
                    {...register('businessRepresentative.position')}
                    error={errors.businessRepresentative?.position?.message}
                    placeholder="Ej: Gerente General"
                  />
                </div>
              </div>
            ) : (
              <>
                <FormInput
                  label="Nombre Completo"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <FormInput
                  label="RUT"
                  {...register('rut')}
                  onChange={handleRutChange}
                  placeholder="12.345.678-9"
                  error={errors.rut?.message}
                />
              </>
            )}

            <FormInput
              label="Correo Electrónico"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <FormInput
              label="Contraseña"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />

            <FormInput
              label="Confirmar Contraseña"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Cuenta
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={isFirstUser}
                onChange={handleRoleChange}
              >
                {isFirstUser ? (
                  <option value="ADMIN">Administrador</option>
                ) : (
                  <>
                    <option value="INDIVIDUAL">Persona Natural</option>
                    <option value="BUSINESS">Empresa</option>
                  </>
                )}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <p className="text-sm text-center text-red-600">
              {errors.root.message}
            </p>
          )}

          <div className="flex flex-col space-y-4">
            <Button type="submit" fullWidth>
              {isFirstUser ? 'Crear Cuenta de Administrador' : 'Registrarse'}
            </Button>

            {!isFirstUser && (
              <Link 
                to="/login" 
                className="text-sm text-center text-primary-600 hover:text-primary-500"
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}