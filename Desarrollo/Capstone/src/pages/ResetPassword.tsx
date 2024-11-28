import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una letra y un número'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }

      alert('Contraseña actualizada exitosamente');
      navigate('/login');
    } catch (error) {
      setError('root', { 
        message: 'Error al restablecer la contraseña' 
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Enlace inválido o expirado
          </h2>
          <Button
            onClick={() => navigate('/forgot-password')}
            className="mt-4"
          >
            Solicitar nuevo enlace
          </Button>
        </div>
      </div>
    );
  }

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
            Restablecer Contraseña
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Nueva Contraseña"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <FormInput
            label="Confirmar Nueva Contraseña"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {errors.root && (
            <p className="text-sm text-center text-red-600">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" fullWidth>
            Restablecer Contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}