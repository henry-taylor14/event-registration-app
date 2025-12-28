import React, { useEffect, useState } from 'react';
import { Event } from '../types/Event';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/userApi.ts';
import RegistrationLayout from './RegistrationLayout';
import Spinner from './Spinner';
import {containerClasses, typographyClasses, formClasses, buttonClasses} from '../styles.ts'


const EventsHome: React.FC= () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState('')
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventData = await getEvents();
        setEvents(eventData)
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        console.log(events)
        setLoading(false);
      }
    };

    fetchEvents();
  }, [setEventId]);

  const handleEventSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setEventId(selectedId);

    const selected = events.find(e => e.eventId === selectedId)
    if (selected) {
      setEventName(selected.eventName || '')
    }

  };

  const handleSubmit = () => {
    if (eventId) {
      navigate(`/register/${eventId}`);
    }
  };

  if (loading) {
    return (
      <div className={containerClasses.pageContainer}>
        <div className={containerClasses.contentContainer}>
          <Spinner/>
        </div>
      </div>
    );
  }

  return (
    <RegistrationLayout eventTitle="Registration">
      <form className={formClasses.formContainer} onSubmit={handleSubmit}>
        <div className={containerClasses.sectionContainer}>
          <h2 className={typographyClasses.sectionTitle}>Find your event</h2>

          <div className={formClasses.formGroup}>
            <label className={typographyClasses.formLabel}>
              Select Event:
            </label>
            <select
              className={formClasses.select}
              value={eventId}
              onChange={handleEventSelection}
            >
              <option value="">-- Choose an event --</option>
              {events.map((event) => (
                <option key={event.eventId} value={event.eventId}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          <button
            className={
              !loading
                ? buttonClasses.secondaryButton
                : buttonClasses.disabledButton
            }
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner/> : 'Register'}
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default EventsHome;
