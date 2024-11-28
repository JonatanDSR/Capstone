import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  users: User[];
  setUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  findUserByEmail: (email: string) => User | undefined;
  findUserByRut: (rut: string) => User | undefined;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      addUser: (user) => {
        set((state) => {
          // Si no hay usuarios, el primero será admin automáticamente
          const isFirstUser = state.users.length === 0;
          if (isFirstUser) {
            user.role = 'ADMIN';
          }

          const existingUser = state.users.find(
            (u) => u.email === user.email || u.rut === user.rut
          );
          if (existingUser) {
            return state;
          }
          
          const newUsers = [...state.users, user];
          console.log('Updated users:', newUsers);
          return { users: newUsers };
        });
      },
      updateUser: (updatedUser) => 
        set((state) => {
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? { ...u, ...updatedUser } : u
          );
          
          return {
            user: state.user?.id === updatedUser.id 
              ? { ...state.user, ...updatedUser }
              : state.user,
            users: updatedUsers,
          };
        }),
      deleteUser: (userId) =>
        set((state) => ({
          user: state.user?.id === userId ? null : state.user,
          users: state.users.filter((u) => u.id !== userId),
          isAuthenticated: state.user?.id === userId ? false : state.isAuthenticated,
        })),
      findUserByEmail: (email) => {
        const user = get().users.find(u => u.email === email);
        console.log('Finding user by email:', email, 'Result:', user);
        return user;
      },
      findUserByRut: (rut) => get().users.find(u => u.rut === rut),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);