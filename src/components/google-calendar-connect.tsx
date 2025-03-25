'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Check, Loader2, X } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';

export function GoogleCalendarConnect() {
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const {
    isLoading,
    isConnected,
    calendarEmail,
    checkConnection,
    getAuthUrl,
    disconnectCalendar,
  } = useGoogleCalendar();

  useEffect(() => {
    const checkCalendarConnection = async () => {
      setIsCheckingConnection(true);
      await checkConnection();
      setIsCheckingConnection(false);
    };

    checkCalendarConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    const authUrl = await getAuthUrl();
    if (authUrl) {
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        authUrl,
        'googleAuthPopup',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      );

      window.addEventListener(
        'message',
        async (event) => {
          if (event.origin !== window.location.origin) return;

          if (event.data && event.data.type === 'GOOGLE_AUTH_CODE') {
            await checkConnection();
          }
        },
        { once: true }
      );
    }
  };

  const handleDisconnect = async () => {
    await disconnectCalendar();
  };

  if (isCheckingConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>
            Conecte sua agenda do Google para gerenciar reuniões
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Verificando conexão...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
        <CardDescription>
          Conecte sua agenda do Google para gerenciar reuniões e disponibilidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Conectado com sucesso</AlertTitle>
            <AlertDescription className="text-green-700">
              Sua agenda do Google ({calendarEmail}) está conectada. Suas reuniões serão
              sincronizadas automaticamente.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Conecte sua agenda</AlertTitle>
            <AlertDescription className="text-blue-700">
              Conecte sua agenda do Google para gerenciar suas reuniões e disponibilidade
              de forma eficiente. Isso permitirá que seus alunos vejam sua disponibilidade
              real e agendem reuniões automaticamente.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Desconectando...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Desconectar Agenda
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Conectar com Google Calendar
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
