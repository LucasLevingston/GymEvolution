'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleConnectButtonProps extends ButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function GoogleConnectButton({
  onSuccess,
  onError,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: GoogleConnectButtonProps) {
  const { isConnected, isConnecting, connect, disconnect } = useGoogleAuth();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      // Note: Success will be handled after redirect back to the app
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to connect to Google';
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnect();
      toast.success('Successfully disconnected from Google Calendar');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to disconnect from Google';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isConnected) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={handleDisconnect}
        disabled={isDisconnecting}
        {...props}
      >
        {isDisconnecting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Disconnecting...
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Google
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleConnect}
      disabled={isConnecting}
      {...props}
    >
      {isConnecting ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Connect with Google
        </>
      )}
    </Button>
  );
}
