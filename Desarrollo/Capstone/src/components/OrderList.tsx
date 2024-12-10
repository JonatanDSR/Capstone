import React from 'react';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import { Package, Truck, CheckCircle, XCircle, Inbox, Trash2, XSquare, Building2, Phone, UserCircle } from 'lucide-react';
import { Button } from './ui/Button';
import type { OrderStatus, User } from '../types';

const statusIcons = {
  RECEIVED: Inbox,
  PENDING: Package,
  IN_PROGRESS: Truck,
  COMPLETED: CheckCircle,
  REJECTED: XCircle,
} as const;

const statusColors = {
  RECEIVED: 'bg-purple-100 text-purple-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
} as const;

const statusLabels = {
  RECEIVED: 'Recibido',
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Proceso',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
} as const;

export function OrderList() {
  const { user, users } = useAuthStore();
  const { orders, updateOrderStatus, deleteOrder } = useOrdersStore();
  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredOrders = React.useMemo(() => {
    let filtered = user?.role === 'ADMIN' 
      ? orders 
      : orders.filter(order => order.userId === user?.id);

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.name.toLowerCase().includes(searchLower) ||
        order.description.toLowerCase().includes(searchLower) ||
        order.id.toString().includes(searchLower) ||
        (user?.role === 'ADMIN' && users.find(u => u.id === order.userId)?.email.toLowerCase().includes(searchLower))
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, user, users, selectedStatus, searchTerm]);

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    if (user?.role !== 'ADMIN') return;
    updateOrderStatus(orderId, newStatus);
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
      updateOrderStatus(orderId, 'REJECTED');
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    if (user?.role !== 'ADMIN') return;
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      deleteOrder(orderId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBusinessDetails = (orderUser: User) => {
    if (orderUser.role !== 'BUSINESS' || !orderUser.businessName) return null;
    
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-start space-x-2 text-sm text-gray-500">
          <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{orderUser.businessName}</p>
            {orderUser.businessAddress && (
              <p className="text-gray-400">{orderUser.businessAddress}</p>
            )}
          </div>
        </div>
        
        {orderUser.businessRepresentative && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserCircle className="h-4 w-4 flex-shrink-0" />
              <span>{orderUser.businessRepresentative.name} - {orderUser.businessRepresentative.position}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{orderUser.businessRepresentative.phone}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {user.role === 'ADMIN' ? 'Todas las Órdenes' : 'Tus Órdenes'}
        </h2>

        <div className="flex space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'ALL')}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Buscar órdenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center text-gray-500">
          No se encontraron órdenes
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const StatusIcon = statusIcons[order.status];
            const orderUser = users.find(u => u.id === order.userId);
            const canCancel = !user.role.includes('ADMIN') && order.status === 'PENDING';
            
            return (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Orden #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.name} • {order.quantity} items
                      </p>
                      {user.role === 'ADMIN' && orderUser && (
                        <>
                          <p className="text-sm text-gray-500">
                            Cliente: {orderUser.name} ({orderUser.email})
                          </p>
                          {renderBusinessDetails(orderUser)}
                        </>
                      )}
                      <p className="text-sm text-gray-500">
                        Creada el: {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    
                    {user.role === 'ADMIN' ? (
                      <>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <Button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : canCancel && (
                      <Button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 inline-flex items-center"
                      >
                        <XSquare className="h-4 w-4 mr-2" />
                        Cancelar Orden
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Descripción</p>
                    <p className="mt-1 text-sm text-gray-900">{order.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dirección de Envío</p>
                    <p className="mt-1 text-sm text-gray-900">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dimensiones</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {order.length}x{order.width}x{order.height} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Peso</p>
                    <p className="mt-1 text-sm text-gray-900">{order.weight} kg</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}