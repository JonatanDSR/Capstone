import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import type { OrderStatus } from '../../types';

export async function createOrder(req: Request, res: Response) {
  const { 
    name, 
    quantity, 
    description, 
    address, 
    height, 
    length, 
    width, 
    weight, 
    userId 
  } = req.body;

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!name || !quantity || !description || !address || !height || !length || !width || !weight || !userId) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        message: 'Por favor complete todos los campos requeridos'
      });
    }

    const order = await prisma.order.create({
      data: {
        name,
        quantity,
        description,
        address,
        height,
        length,
        width,
        weight,
        userId,
        status: 'PENDING',
      },
    });

    // Asegurarse de que la respuesta sea un JSON válido
    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      error: 'Error al crear la orden',
      message: 'Ocurrió un error al procesar su solicitud'
    });
  }
}

// Los otros métodos permanecen igual