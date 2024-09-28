import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/Button";
import { Calendar } from "@/app/components/ui/calendar";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  popoverOpen: boolean; 
  setPopoverOpen: (open: boolean) => void; 
}

const DatePicker = ({ currentDate, setCurrentDate, popoverOpen, setPopoverOpen }: DatePickerProps) => {
  const formattedDate = format(currentDate, 'MMMM dd, yyyy');

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex-grow text-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => {
            if (date) {
              setCurrentDate(date);
              setPopoverOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
