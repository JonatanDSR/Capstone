import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from '../ui/FormInput';
import type { RegisterFormData } from '../../schemas/register';

interface BusinessRegistrationFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  onRutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRepPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BusinessRegistrationFields({
  register,
  errors,
  onRutChange,
  onPhoneChange,
  onRepPhoneChange,
}: BusinessRegistrationFieldsProps) {
  return (
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
          onChange={onRepPhoneChange}
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
  );
}