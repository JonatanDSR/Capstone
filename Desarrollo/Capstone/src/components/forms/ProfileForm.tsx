import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../schemas/profile';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import type { ProfileFormData } from '../../types';

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ defaultValues, onSubmit, isLoading }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
        disabled={isLoading}
      />
      
      <FormInput
        label="Correo Electrónico"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isLoading}
      />
      
      <FormInput
        label="RUT"
        {...register('rut')}
        error={errors.rut?.message}
        disabled={isLoading}
      />

      <Button 
        type="submit" 
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
      </Button>
    </form>
  );
}