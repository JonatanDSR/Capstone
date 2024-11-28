import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../services/emailService';
import { useAuthStore } from '../../store/auth';

const router = express.Router();

router.post('/forgot-password', asyncHandler(async (req, res) => {
  console.log('Received password reset request for:', req.body.email);
  
  const { email } = req.body;

  if (!email) {
    console.log('Email missing in request');
    return res.status(400).json({ 
      error: 'El correo electrónico es requerido',
      details: 'Por favor proporcione un correo electrónico válido'
    });
  }

  try {
    const { findUserByEmail } = useAuthStore.getState();
    const user = findUserByEmail(email);

    console.log('Looking up user:', email, 'Found:', !!user);

    if (!user) {
      return res.status(404).json({ 
        error: 'No existe una cuenta con este correo electrónico',
        details: 'Verifique que el correo electrónico sea correcto'
      });
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'setralog-secret-key',
      { expiresIn: '1h' }
    );

    console.log('Generated reset token for user:', user.id);

    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('Password reset email sent successfully');
      
      return res.json({ 
        message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
        success: true
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      return res.status(500).json({ 
        error: 'Error al enviar el correo de recuperación',
        details: 'Hubo un problema al enviar el correo. Por favor intente nuevamente más tarde.',
        technicalDetails: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: 'Ocurrió un error inesperado. Por favor intente nuevamente más tarde.'
    });
  }
}));

export default router;