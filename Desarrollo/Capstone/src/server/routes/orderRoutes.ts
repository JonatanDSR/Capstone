import express from 'express';
import { OrderStatus } from '../../types';
import { useOrdersStore } from '../../store/orders';

const router = express.Router();

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const { userId, role } = req.query;
    const { orders } = useOrdersStore.getState();
    
    const filteredOrders = role === 'ADMIN' 
      ? orders 
      : orders.filter(order => order.userId === userId);
    
    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error al cargar las órdenes' });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const { addOrder } = useOrdersStore.getState();
    const orderData = {
      ...req.body,
      status: 'PENDING' as OrderStatus,
      createdAt: new Date(),
    };
    
    const newOrder = addOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { updateOrderStatus } = useOrdersStore.getState();
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    updateOrderStatus(orderId, status);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

export default router;