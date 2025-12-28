import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '../types/Event';
import { getEventInfo } from '../api/userApi';

interface EventContextType {
  eventId: string;
  setEventId: (id: string) => void;
  currentEvent: Event | null;
  loadingEvent: boolean;
}

const EventContext = createContext<EventContextType>({
  eventId: '',
  setEventId: () => {},
  currentEvent: null,
  loadingEvent: false,
});

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventId, setEventId] = useState('');
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setCurrentEvent(null);
        return;
      }
      setLoadingEvent(true);
      try {
        const fullEvent = await getEventInfo(eventId);
        setCurrentEvent(fullEvent);
      } catch (error) {
        console.error('Error loading event in context:', error);
        setCurrentEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <EventContext.Provider value={{ eventId, setEventId, currentEvent, loadingEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
