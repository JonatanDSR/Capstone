import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage('');
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el correo de recuperación');
      }

      setSuccessMessage('Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('root', {
        message: error instanceof Error ? error.message : 'Error al enviar el correo de recuperación'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Correo Electrónico"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />

          {errors.root && (
            <p className="text-sm text-center text-red-600">
              {errors.root.message}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-center text-green-600">
              {successMessage}
            </p>
          )}

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </Button>

            <Link 
              to="/login" 
              className="text-sm text-center text-primary-600 hover:text-primary-500"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}