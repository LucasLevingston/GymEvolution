import api from '@/lib/api';
import { useState, useEffect } from 'react';
import useUser from './user-hooks';
import { toast } from 'sonner';

interface ConnectionInfo {
  email: string;
  name?: string;
  picture?: string;
  expiresAt?: number;
}

interface GoogleAuthState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionInfo: ConnectionInfo | null;
  error: string | null;
}

export function useGoogleAuth() {
  const [state, setState] = useState<GoogleAuthState>({
    isConnected: false,
    isConnecting: false,
    connectionInfo: null,
    error: null,
  });
  const { token } = useUser();

  useEffect(() => {
    checkConnectionStatus();
  }, []);
  const checkConnectionStatus = async () => {
    try {
      const { data } = await api.get('/google/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.connected) {
        setState({
          isConnected: true,
          isConnecting: false,
          connectionInfo: {
            email: data.email,
            name: data.name,
            picture: data.picture,
            expiresAt: data.expiresAt,
          },
          error: null,
        });
      } else {
        setState({
          isConnected: false,
          isConnecting: false,
          connectionInfo: null,
          error: null,
        });
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Failed to check connection status',
      }));
    }
  };

  const connect = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const { data } = await api.get('/auth/google', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.authUrl) {
        throw new Error(data.error || 'Failed to start Google authentication');
      }

      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error starting Google authentication:', error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Google',
      }));
    }
  };

  const refreshToken = async (code: string) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const { data } = await api.post('/google/token', { code });

      if (!data) {
        throw new Error('Failed to exchange code for tokens');
      }

      setState({
        isConnected: true,
        isConnecting: false,
        connectionInfo: {
          email: data.email,
          name: data.name,
          picture: data.picture,
          expiresAt: data.expiresAt,
        },
        error: null,
      });

      return data;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Google',
      }));
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await api.post('/google/disconnect');

      setState({
        isConnected: false,
        isConnecting: false,
        connectionInfo: null,
        error: null,
      });
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to disconnect from Google',
      }));
      throw error;
    }
  };

  return {
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    connectionInfo: state.connectionInfo,
    error: state.error,
    connect,
    disconnect,
    refreshToken,
    checkConnectionStatus,
  };
}
