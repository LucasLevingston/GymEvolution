import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BsJournalText } from 'react-icons/bs';
import useUser from '@/hooks/user-hooks';
import { formatDate } from '@/estatico';
import { Button } from './ui/button';

export default function HistoryButton() {
  const { user } = useUser();

  return (
    <div>
      {user?.history && (
        <Sheet>
          <SheetTrigger>
            <Button variant={'ghost'}>
              <span>History</span>
              <BsJournalText className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">History</SheetTitle>
              <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
                {user?.history.map((eventItem) => (
                  <SheetDescription
                    key={eventItem.id}
                    className="mb-4 rounded-lg  p-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg border"
                  >
                    <span className=" block text-lg font-semibold">
                      {eventItem.event}
                    </span>
                    <span className="text-sm">{formatDate(eventItem.date)}</span>
                  </SheetDescription>
                ))}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
