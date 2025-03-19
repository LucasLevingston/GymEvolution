import axios from 'axios';
import type { UserType } from '@/types/userType';
import { useUserStore } from '@/store/user-store';
import { env } from '@/env';

const baseUrl = `${env.VITE_API_URL}`;

export const useUser = () => {
  const {
    setUser,
    user,
    clearUser,
    updateUser: updateUserStore,
    token,
    setToken,
  } = useUserStore();

  const getUser = async (id: string): Promise<UserType> => {
    const response = await axios.get<UserType>(`${baseUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    if (response.data.id === user?.id) {
      setUser(response.data);
    }

    return response.data;
  };

  const login = async (email: string, password: string): Promise<UserType> => {
    const data = { email, password };
    try {
      const response = await axios.post<{ user: UserType; token: string }>(
        `${baseUrl}/auth/login`,
        data
      );
      if (response.status !== 200) throw new Error('Error on login');
      setUser(response.data.user);
      setToken(response.data.token);

      return response.data.user;
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
      const response = await axios.post<UserType>(`${baseUrl}/auth/register`, newUser);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const updateUser = async (updatedUser: Partial<UserType>): Promise<UserType> => {
    try {
      const response = await axios.put<UserType>(
        `${baseUrl}/users/${updatedUser.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      updateUserStore(response.data);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    clearUser();
  };

  const passwordRecover = async (email: string) => {
    try {
      const response = await axios.post<{ message: string }>(
        `${baseUrl}/auth/password-recover`,
        { email }
      );
      if (!response) {
        throw new Error('Error on axios');
      }

      return response.data.message;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };
  const resetPassword = async (data: { token: string; password: string }) => {
    try {
      const response = await axios.post<{ message: string }>(
        `${baseUrl}/auth/reset-password`,
        data
      );
      if (!response) {
        throw new Error('Error on axios');
      }

      return response.data.message;
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
  };
};

export default useUser;
