import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { setUser, findUserByEmail } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const user = findUserByEmail(data.email);
    
    if (!user || user.password !== data.password) {
      setError('root', { message: 'Correo o contraseña inválidos' });
      return;
    }

    setUser(user);
    navigate('/');
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
            Iniciar Sesión
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
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
          </div>

          {errors.root && (
            <p className="text-sm text-center text-red-600">{errors.root.message}</p>
          )}

          <div className="flex flex-col space-y-4">
            <Button type="submit" fullWidth>
              Ingresar
            </Button>

            <Link 
              to="/forgot-password" 
              className="text-sm text-center text-primary-600 hover:text-primary-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Link 
              to="/register" 
              className="text-sm text-center text-primary-600 hover:text-primary-500"
            >
              ¿No tienes una cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}