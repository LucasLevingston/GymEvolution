import { useState } from 'react';
import axios from 'axios';
import { HistoryType } from '@/types/userType';
import useUser from './user-hooks';
import { env } from '@/env';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryType[]>([]);
  const { token } = useUser();

  const baseUrl = `${env.VITE_API_URL}/history`;

  const getHistory = async () => {
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  };

  return {
    history,
    getHistory,
  };
};
