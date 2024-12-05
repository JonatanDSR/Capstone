import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import { ProfileForm } from '../components/forms/ProfileForm';
import { PasswordChangeForm } from '../components/forms/PasswordChangeForm';
import { UserManagement } from '../components/admin/UserManagement';
import { Button } from '../components/ui/Button';
import type { ProfileFormData, PasswordChangeData } from '../types';

export function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, deleteUser } = useAuthStore();
  const { orders } = useOrdersStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      updateUser({
        id: user?.id,
        ...data
      });

      setSuccess('Perfil actualizado exitosamente');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: PasswordChangeData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (!user || user.password !== data.currentPassword) {
        setError('La contraseña actual es incorrecta');
        return;
      }

      updateUser({
        id: user.id,
        password: data.newPassword
      });

      setSuccess('Contraseña actualizada exitosamente');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    const userOrders = orders.filter(order => order.userId === user.id);
    if (userOrders.some(order => order.status === 'IN_PROGRESS')) {
      setError('No puedes eliminar tu cuenta mientras tengas órdenes en proceso');
      return;
    }

    try {
      deleteUser(user.id);
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Error al eliminar la cuenta');
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-gray-600">
          Por favor inicia sesión para ver tu perfil
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <ProfileForm
            defaultValues={{
              name: user.name,
              email: user.email,
              rut: user.rut,
            }}
            onSubmit={handleProfileSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
          <PasswordChangeForm
            onSubmit={handlePasswordChange}
            isLoading={isLoading}
          />
        </div>

        {user.role === 'ADMIN' ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <UserManagement />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Eliminar Cuenta</h2>
            <p className="text-gray-600 mb-4">
              Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos y no podrás recuperar tu cuenta.
            </p>
            
            {!showDeleteConfirm ? (
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                fullWidth
              >
                Eliminar mi cuenta
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  ¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    fullWidth
                  >
                    Sí, eliminar mi cuenta
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}