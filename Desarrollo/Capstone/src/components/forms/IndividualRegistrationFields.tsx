import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from '../ui/FormInput';
import type { RegisterFormData } from '../../schemas/register';

interface IndividualRegistrationFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  onRutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function IndividualRegistrationFields({
  register,
  errors,
  onRutChange,
  onPhoneChange,
}: IndividualRegistrationFieldsProps) {
  return (
    <>
      <FormInput
        label="Nombre Completo"
        {...register('name')}
        error={errors.name?.message}
      />

      <FormInput
        label="RUT"
        {...register('rut')}
        onChange={onRutChange}
        placeholder="12.345.678-9"
        error={errors.rut?.message}
      />

      <FormInput
        label="Teléfono"
        {...register('phone')}
        onChange={onPhoneChange}
        placeholder="+56912345678"
        error={errors.phone?.message}
      />
    </>
  );
}