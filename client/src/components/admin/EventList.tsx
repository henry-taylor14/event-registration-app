import React, { useState } from 'react';
import { Event } from '../../types/Event';
import { Button } from '../ui/button';
import EmailRegistrantsModal from './EmailRegistrantsModal';
import { Mail, Pencil, Trash2 } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventClick, onDeleteEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <div className="space-y-2">
        {events.map(evt => (
          <div key={evt.eventId} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{evt.eventName}</h3>
              <p className="text-sm text-gray-600">
                {evt.eventDate instanceof Date
                  ? evt.eventDate.toLocaleDateString()
                  : 'Invalid date'}
              </p>
            </div>

            <div className="flex space-x-2">
              {/* Email Button */}
              <Button
                variant="secondary"
                onClick={() => setSelectedEvent(evt)}
                className="hidden sm:inline-flex"
              >
                Email Registrants
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedEvent(evt)}
                size="icon"
                className="sm:hidden"
              >
                <Mail className="h-4 w-4" />
              </Button>

              {/* Edit Button */}
              <Button
                onClick={() => onEventClick(evt.eventId)}
                className="hidden sm:inline-flex"
              >
                Edit
              </Button>
              <Button
                onClick={() => onEventClick(evt.eventId)}
                size="icon"
                variant="ghost"
                className="sm:hidden"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              {/* Delete Button */}
              <Button
                variant="destructive"
                onClick={() => onDeleteEvent(evt.eventId)}
                className="hidden sm:inline-flex"
              >
                Delete
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDeleteEvent(evt.eventId)}
                className="sm:hidden"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EmailRegistrantsModal
          open={!!selectedEvent}
          eventId={selectedEvent.eventId}
          eventName={selectedEvent.eventName}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};

export default EventList;
