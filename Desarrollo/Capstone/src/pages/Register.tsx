import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { formatRut } from '../utils/rut';
import { formatChileanPhone } from '../utils/validation';
import { Button } from '../components/ui/Button';
import { IndividualRegistrationFields } from '../components/forms/IndividualRegistrationFields';
import { BusinessRegistrationFields } from '../components/forms/BusinessRegistrationFields';
import { CommonRegistrationFields } from '../components/forms/CommonRegistrationFields';
import { registerSchema, type RegisterFormData } from '../schemas/register';
import type { UserRole } from '../types';

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
    setValue('phone', formatted);
  };

  const handleRepPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              <BusinessRegistrationFields
                register={register}
                errors={errors}
                onRutChange={handleRutChange}
                onPhoneChange={handlePhoneChange}
                onRepPhoneChange={handleRepPhoneChange}
              />
            ) : (
              <IndividualRegistrationFields
                register={register}
                errors={errors}
                onRutChange={handleRutChange}
                onPhoneChange={handlePhoneChange}
              />
            )}

            <CommonRegistrationFields
              register={register}
              errors={errors}
              isFirstUser={isFirstUser}
              onRoleChange={handleRoleChange}
            />
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