import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderStatus } from '../types';

interface OrdersState {
  orders: Order[];
  lastOrderId: number;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  deleteOrder: (orderId: number) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: 0,
      setOrders: (orders) => set({ orders }),
      addOrder: (orderData) => {
        const newOrder = {
          ...orderData,
          id: get().lastOrderId + 1,
          status: 'PENDING' as OrderStatus, // Changed from 'RECEIVED' to 'PENDING'
          createdAt: new Date(),
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder],
          lastOrderId: state.lastOrderId + 1,
        }));
        
        return newOrder;
      },
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),
      deleteOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        })),
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        lastOrderId: state.lastOrderId,
      }),
    }
  )
);