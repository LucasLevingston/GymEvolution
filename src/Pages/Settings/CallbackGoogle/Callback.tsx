'use client';

import { useEffect } from 'react';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshToken } = useGoogleAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const handleCallback = async () => {
      if (code) {
        try {
          await refreshToken(code);
          toast.success('Successfully connected to Google Calendar');
          navigate('/connect-google');
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
          toast.error('Failed to connect to Google Calendar');
          navigate('/connect-google?error=token_exchange_failed');
        }
      } else if (error) {
        toast.error(`Google authentication failed: ${error}`);
        navigate(`/connect-google?error=${error}`);
      } else {
        navigate('/connect-google');
      }
    };

    handleCallback();
  }, [searchParams, refreshToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processando autenticação do Google...</h1>
        <LoadingSpinner />
      </div>
    </div>
  );
}
