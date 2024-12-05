import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import { Button } from './ui/Button';
import { FormInput } from './ui/FormInput';

const orderSchema = z.object({
  name: z.string().min(1, 'El nombre de la orden es requerido'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1'),
  description: z.string().min(1, 'La descripción es requerida'),
  address: z.string().min(1, 'La dirección de envío es requerida'),
  height: z.coerce.number().min(0.1, 'La altura debe ser mayor a 0'),
  length: z.coerce.number().min(0.1, 'El largo debe ser mayor a 0'),
  width: z.coerce.number().min(0.1, 'El ancho debe ser mayor a 0'),
  weight: z.coerce.number().min(0.1, 'El peso debe ser mayor a 0'),
});

type OrderFormData = z.infer<typeof orderSchema>;

export function OrderForm() {
  const { user } = useAuthStore();
  const { addOrder } = useOrdersStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = (data: OrderFormData) => {
    if (!user) return;

    const newOrder = {
      ...data,
      userId: user.id,
    };

    addOrder(newOrder);
    reset();
    alert('Orden creada exitosamente');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Crear Nueva Orden de Despacho</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Nombre de la Orden"
            {...register('name')}
            error={errors.name?.message}
          />

          <FormInput
            label="Cantidad"
            type="number"
            min="1"
            step="1"
            {...register('quantity')}
            error={errors.quantity?.message}
          />

          <div className="col-span-2">
            <FormInput
              label="Descripción"
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="col-span-2">
            <FormInput
              label="Dirección de Envío"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>

          <FormInput
            label="Largo (cm)"
            type="number"
            step="0.1"
            min="0.1"
            {...register('length')}
            error={errors.length?.message}
          />

          <FormInput
            label="Ancho (cm)"
            type="number"
            step="0.1"
            min="0.1"
            {...register('width')}
            error={errors.width?.message}
          />

          <FormInput
            label="Alto (cm)"
            type="number"
            step="0.1"
            min="0.1"
            {...register('height')}
            error={errors.height?.message}
          />

          <FormInput
            label="Peso (kg)"
            type="number"
            step="0.1"
            min="0.1"
            {...register('weight')}
            error={errors.weight?.message}
          />
        </div>

        <div className="mt-6">
          <Button 
            type="submit" 
            fullWidth
          >
            Crear Orden
          </Button>
        </div>
      </div>
    </form>
  );
}