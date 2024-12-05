import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordChangeSchema } from '../../schemas/profile';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import type { PasswordChangeData } from '../../types';

interface PasswordChangeFormProps {
  onSubmit: (data: PasswordChangeData) => Promise<void>;
  isLoading?: boolean;
}

export function PasswordChangeForm({ onSubmit, isLoading }: PasswordChangeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const handleFormSubmit = async (data: PasswordChangeData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormInput
        label="Contraseña Actual"
        type="password"
        {...register('currentPassword')}
        error={errors.currentPassword?.message}
        disabled={isLoading}
      />
      
      <FormInput
        label="Nueva Contraseña"
        type="password"
        {...register('newPassword')}
        error={errors.newPassword?.message}
        disabled={isLoading}
      />
      
      <FormInput
        label="Confirmar Nueva Contraseña"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        disabled={isLoading}
      />

      <Button 
        type="submit" 
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Cambiando Contraseña...' : 'Cambiar Contraseña'}
      </Button>
    </form>
  );
}