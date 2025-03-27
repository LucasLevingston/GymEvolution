import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const localizer = momentLocalizer(moment);

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  recurrence?: string[];
  colorId?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource?: {
    location?: string;
    description?: string;
    color?: string;
  };
}

export default function Meetings() {
  const { getUserCalendar, isLoading } = useGoogleCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  const transformEvents = (
    googleEvents: GoogleCalendarEvent[] | undefined
  ): CalendarEvent[] => {
    if (!googleEvents || !Array.isArray(googleEvents)) return [];

    const transformedEvents = googleEvents.map((event: GoogleCalendarEvent) => ({
      id: event.id,
      title: event.summary || 'No Title',
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || ''),
      allDay: !event.start?.dateTime,
      resource: {
        location: event.location || '',
        description: event.description || '',
        color: event.colorId ? getColorForId(event.colorId) : '#1aaa55',
      },
    }));

    console.log('Transformed events:', transformedEvents);
    return transformedEvents;
  };

  const getColorForId = (colorId: string): string => {
    const colorMap: Record<string, string> = {
      '1': '#7986cb',
      '2': '#33b679',
      '3': '#8e24aa',
      '4': '#e67c73',
      '5': '#f6bf26',
      '6': '#f4511e',
      '7': '#039be5',
      '8': '#616161',
      '9': '#3f51b5',
      '10': '#0b8043',
      '11': '#d50000',
    };

    return colorMap[colorId] || '#1aaa55';
  };

  const loadCalendarEvents = async (): Promise<void> => {
    try {
      setRefreshing(true);
      const calendarData: GoogleCalendarEvent[] = await getUserCalendar();

      if (calendarData) {
        const transformedEvents = transformEvents(calendarData);
        setEvents(transformedEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load calendar events:', err);
      toast.error('Failed to load calendar events');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCalendarEvents();
  }, []);

  const handleRefresh = (): void => {
    loadCalendarEvents();
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const backgroundColor = event.resource?.color || '#1aaa55';
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: '#fff',
        border: '0px',
        display: 'block',
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    return (
      <div className="flex justify-between items-center mb-4 p-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('PREV')}>
            &lt;
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('NEXT')}>
            &gt;
          </Button>
          <span className="text-lg font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={view === Views.MONTH ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(Views.MONTH)}
              className="rounded-none"
            >
              Month
            </Button>
            <Button
              variant={view === Views.WEEK ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(Views.WEEK)}
              className="rounded-none"
            >
              Week
            </Button>
            <Button
              variant={view === Views.DAY ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(Views.DAY)}
              className="rounded-none"
            >
              Day
            </Button>
            <Button
              variant={view === Views.AGENDA ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onView(Views.AGENDA)}
              className="rounded-none"
            >
              Agenda
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading || refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    );
  };

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full overflow-hidden text-white p-1 text-sm">
              {event.title}
              {event.resource?.location && (
                <div className="text-xs opacity-80 truncate">
                  📍 {event.resource.location}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <h4 className="font-bold">{event.title}</h4>
              <p className="text-xs">
                {moment(event.start).format('LT')} - {moment(event.end).format('LT')}
              </p>
              {event.resource?.location && (
                <p className="text-xs mt-1">📍 {event.resource.location}</p>
              )}
              {event.resource?.description && (
                <p className="text-xs mt-1">{event.resource.description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-2xl font-bold">My Calendar</h1>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            view={view}
            onView={(newView: View) => setView(newView)}
            date={date}
            onNavigate={(newDate: Date) => setDate(newDate)}
            eventPropGetter={eventPropGetter}
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
            popup
            selectable={false}
            longPressThreshold={10}
          />
        </CardContent>
      </Card>

      {(isLoading || refreshing) && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span>Loading calendar events...</span>
          </div>
        </div>
      )}
    </div>
  );
}
