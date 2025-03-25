import type { UserType } from '@/types/userType';
import { useUserStore } from '@/store/user-store';
import api from '@/lib/api';
import { Professional } from '@/types/ProfessionalType';
import { useEffect } from 'react';

export const useUser = () => {
  const {
    setUser,
    user,
    clearUser,
    updateUser: updateUserStore,
    token,
    setToken,
  } = useUserStore();

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async (): Promise<boolean> => {
    try {
      if (!token) {
        return false;
      }

      const { data } = await api.post(
        '/auth/validate-token',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data) {
        logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
      return false;
    }
  };

  const getUser = async (id: string): Promise<UserType> => {
    const { data } = await api.get<UserType>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data) {
      throw new Error('No data received from server');
    }

    if (data.id === user?.id) {
      setUser(data);
    }

    return data;
  };

  const getNutritionists = async (): Promise<Professional[]> => {
    try {
      const { data } = await api.get('/users/role/nutritionists');

      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };
  const getTrainers = async (): Promise<Professional[]> => {
    try {
      const { data } = await api.get('/users/role/trainers');
      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const login = async (loginData: {
    email: string;
    password: string;
  }): Promise<UserType> => {
    try {
      const { data } = await api.post('/auth/login', loginData);

      if (!data) throw new Error('Error on request to login');
      setUser(data.user);
      setToken(data.token);

      return data.user;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const createUser = async (newUser: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserType> => {
    try {
      const { data } = await api.post('/auth/register', newUser);

      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const updateUser = async (updatedUser: Partial<UserType>): Promise<UserType> => {
    try {
      const { data } = await api.put(`/users/${updatedUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateUserStore(data);

      return data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    clearUser();
  };

  const passwordRecover = async (email: string) => {
    try {
      const { data } = await api.post('/auth/password-recover', { email });
      if (!data) {
        throw new Error('Error on request to password recover');
      }

      return data.message;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };
  const resetPassword = async (newPassword: { token: string; password: string }) => {
    try {
      const { data } = await api.post('/auth/reset-password', newPassword);
      if (!data) {
        throw new Error('Error on request to reset password');
      }

      return data.message;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const getBasalMetabolicRate = (): number | null => {
    if (!user?.currentWeight || !user.height || !user.birthDate || !user.sex) {
      return null;
    }

    const weight = Number.parseFloat(user.currentWeight);
    const height = Number.parseFloat(user.height);
    const birthDate = new Date(user.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (user.sex === 'male') {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    }

    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  };

  interface RelationshipData {
    studentId: string;
    nutritionistId?: string;
    trainerId?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  }
  const createRelationship = async (data: RelationshipData): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Relationship data:', data);
    return { success: true };
  };

  const getRelationships = async (userId: string): Promise<any[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Fetching relationships for user ID:', userId);
    return [];
  };

  const updateRelationship = async (
    relationshipId: string,
    data: { status: 'PENDING' | 'ACCEPTED' | 'REJECTED' }
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Updating relationship ${relationshipId} with data:`, data);
  };

  return {
    user,
    login,
    logout,
    createUser,
    getUser,
    updateUser,
    passwordRecover,
    resetPassword,
    token,
    getBasalMetabolicRate,
    getNutritionists,
    getTrainers,
    createRelationship,
    getRelationships,
    updateRelationship,
  };
};

export default useUser;
