import React from 'react';
import { OrderForm } from '../components/OrderForm';
import { OrderList } from '../components/OrderList';
import { useAuthStore } from '../store/auth';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {user?.role !== 'ADMIN' && <OrderForm />}
      <OrderList />
    </div>
  );
}