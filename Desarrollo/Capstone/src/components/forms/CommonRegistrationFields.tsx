import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from '../ui/FormInput';
import type { RegisterFormData } from '../../schemas/register';
import type { UserRole } from '../../types';

interface CommonRegistrationFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  isFirstUser: boolean;
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function CommonRegistrationFields({
  register,
  errors,
  isFirstUser,
  onRoleChange,
}: CommonRegistrationFieldsProps) {
  return (
    <>
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
          onChange={onRoleChange}
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
    </>
  );
}