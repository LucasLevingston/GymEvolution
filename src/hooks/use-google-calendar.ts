import { useState, useCallback } from 'react';
import { useUser } from './user-hooks';
import { useToast } from './use-toast';
import api from '@/lib/api';

interface TimeSlot {
  start: string;
  end: string;
}

interface MeetingEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  meetLink?: string;
  attendees?: string[];
}

interface UseGoogleCalendarReturn {
  isLoading: boolean;
  isConnected: boolean;
  calendarEmail: string | undefined;

  checkConnection: () => Promise<boolean>;
  connectCalendar: (authCode: string) => Promise<boolean>;
  disconnectCalendar: () => Promise<boolean>;
  getAuthUrl: () => Promise<string>;

  getAvailability: (professionalId: string, date: string) => Promise<TimeSlot[]>;
  createMeeting: (
    meeting: Omit<MeetingEvent, 'id' | 'meetLink'>
  ) => Promise<MeetingEvent | null>;
  updateMeeting: (
    meetingId: string,
    updates: Partial<Omit<MeetingEvent, 'id' | 'meetLink'>>
  ) => Promise<boolean>;
  deleteMeeting: (meetingId: string) => Promise<boolean>;
  getMeetingDetails: (meetingId: string) => Promise<MeetingEvent | null>;

  getProfessionalAvailability: (professionalId: string, date: string) => Promise<any>;
  getWorkingHours: (professionalId: string) => Promise<any[]>;
  updateWorkingHours: (workingHours: any[]) => Promise<boolean>;
  getUserCalendar: () => Promise<any>;
}

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const { user, token } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [calendarEmail, setCalendarEmail] = useState<string | undefined>(undefined);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      const { data } = await api.get('/google/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data) {
        throw new Error('Failed to check Google Calendar connection');
      }

      setIsConnected(data.connected);
      setCalendarEmail(data.email);

      return data.connected;
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const getAuthUrl = useCallback(async (): Promise<string> => {
    try {
      const { data } = await api.get('/google/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data) {
        throw new Error('Failed to get auth URL');
      }

      return data.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível obter o URL de autenticação do Google.',
      });
      return '';
    }
  }, [toast]);
  const getProfessionalAvailability = useCallback(
    async (professionalId: string, date: string): Promise<any> => {
      try {
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          throw new Error('Date must be in YYYY-MM-DD format');
        }

        const { data } = await api.get(`/meetings/availability/${professionalId}`, {
          params: { date },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data) {
          throw new Error('Failed to get professional availability');
        }

        return data;
      } catch (error) {
        console.error('Error getting professional availability:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível obter a disponibilidade do profissional.',
        });
        return [];
      }
    },
    [toast, token]
  );

  const getUserCalendar = useCallback(async (): Promise<string> => {
    try {
      const { data } = await api.get('/meetings/calendar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data) {
        throw new Error('Failed to get auth URL');
      }

      return data;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível obter o URL de autenticação do Google.',
      });
      return '';
    }
  }, [toast]);

  const connectCalendar = useCallback(
    async (authCode: string): Promise<boolean> => {
      if (!user?.id) return false;

      setIsLoading(true);
      try {
        const response = await fetch('/api/meetings/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: authCode }),
        });

        if (!response.ok) {
          throw new Error('Failed to connect Google Calendar');
        }

        const data = await response.json();
        setIsConnected(true);
        setCalendarEmail(data.email);

        toast({
          title: 'Conectado com sucesso',
          description: 'Sua agenda do Google foi conectada com sucesso.',
        });

        return true;
      } catch (error) {
        console.error('Error connecting Google Calendar:', error);
        toast({
          variant: 'destructive',
          title: 'Erro na conexão',
          description: 'Não foi possível conectar sua agenda do Google.',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, toast]
  );

  const disconnectCalendar = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      const response = await fetch('/api/meetings/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect Google Calendar');
      }

      setIsConnected(false);
      setCalendarEmail(undefined);

      toast({
        title: 'Desconectado',
        description: 'Sua agenda do Google foi desconectada com sucesso.',
      });

      return true;
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível desconectar sua agenda do Google.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const getAvailability = useCallback(
    async (professionalId: string, date: string): Promise<TimeSlot[]> => {
      setIsLoading(true);
      try {
        const { data } = await api.get(
          `/meetings/availability/${professionalId}?date=${date}`
        );

        if (!data) {
          throw new Error('Failed to fetch availability');
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível obter a disponibilidade do profissional.',
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const createMeeting = useCallback(
    async (
      meeting: Omit<MeetingEvent, 'id' | 'meetLink'>
    ): Promise<MeetingEvent | null> => {
      if (!user?.id) return null;

      setIsLoading(true);
      try {
        const response = await fetch('/api/meetings/meetings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meeting),
        });

        if (!response.ok) {
          throw new Error('Failed to create meeting');
        }

        const data = await response.json();

        toast({
          title: 'Reunião agendada',
          description: 'Sua reunião foi agendada com sucesso.',
        });

        return data;
      } catch (error) {
        console.error('Error creating meeting:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível agendar a reunião.',
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, toast]
  );

  const updateMeeting = useCallback(
    async (
      meetingId: string,
      updates: Partial<Omit<MeetingEvent, 'id' | 'meetLink'>>
    ): Promise<boolean> => {
      if (!user?.id) return false;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/meetings/meetings/${meetingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Failed to update meeting');
        }

        toast({
          title: 'Reunião atualizada',
          description: 'Sua reunião foi atualizada com sucesso.',
        });

        return true;
      } catch (error) {
        console.error('Error updating meeting:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível atualizar a reunião.',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, toast]
  );

  const deleteMeeting = useCallback(
    async (meetingId: string): Promise<boolean> => {
      if (!user?.id) return false;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/meetings/meetings/${meetingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete meeting');
        }

        toast({
          title: 'Reunião cancelada',
          description: 'Sua reunião foi cancelada com sucesso.',
        });

        return true;
      } catch (error) {
        console.error('Error deleting meeting:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível cancelar a reunião.',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, toast]
  );

  const getMeetingDetails = useCallback(
    async (meetingId: string): Promise<MeetingEvent | null> => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/meetings/meetings/${meetingId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meeting details');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível obter os detalhes da reunião.',
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const getWorkingHours = useCallback(
    async (professionalId: string): Promise<any[]> => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/meetings/working-hours/${professionalId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch working hours');
        }

        const data = await response.json();
        return data.workingHours || [];
      } catch (error) {
        console.error('Error fetching working hours:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível obter os horários de trabalho.',
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const updateWorkingHours = useCallback(
    async (workingHours: any[]): Promise<boolean> => {
      if (!user?.id) return false;

      setIsLoading(true);
      try {
        const response = await fetch('/api/meetings/working-hours', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workingHours }),
        });

        if (!response.ok) {
          throw new Error('Failed to update working hours');
        }

        toast({
          title: 'Horários atualizados',
          description: 'Seus horários de trabalho foram atualizados com sucesso.',
        });

        return true;
      } catch (error) {
        console.error('Error updating working hours:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível atualizar os horários de trabalho.',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, toast]
  );

  return {
    isLoading,
    isConnected,
    calendarEmail,
    getUserCalendar,
    checkConnection,
    connectCalendar,
    disconnectCalendar,
    getAuthUrl,
    getAvailability,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetingDetails,
    getWorkingHours,
    updateWorkingHours,
    getProfessionalAvailability,
  };
}
