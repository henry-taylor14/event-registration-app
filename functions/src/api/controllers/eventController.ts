// functions/src/eventController.ts

import { Request, Response } from 'express';
import { db } from '../../config/admin';
import { Timestamp } from 'firebase-admin/firestore';

const parseDate = (input: any): Date | null => {
  if (!input) return null;

  if (typeof input === 'object' && typeof input.toDate === 'function') {
    return input.toDate(); // Firestore Timestamp
  }

  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
};


export const getEventInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const eventId = req.params.eventId;
    const docSnap = await db.collection('events').doc(eventId).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const data = docSnap.data();

    if (!data) {
      return res.status(404).json({ error: 'Event not found' });
    }

    data.eventDate = parseDate(data.eventDate);
    data.registrationStartDate = parseDate(data.registrationStartDate);

    if (Array.isArray(data.priceTiers)) {
      data.priceTiers = data.priceTiers.map((tier: any) => ({
        ...tier,
        priceChangeDate: parseDate(tier.priceChangeDate),
      }));
    }

    const now = new Date();
    data.registrationOpen = now >= data.registrationStartDate && now <= data.eventDate;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).send('Error getting event');
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('events').get();
    const now = new Date();

    const events = snapshot.docs.map(doc => {
      const data = doc.data();

      const registrationStartDate = parseDate(data.registrationStartDate);
      const eventDate = parseDate(data.eventDate);

      if (!registrationStartDate || !eventDate) {
        throw new Error("Date is missing");
      }

      const registrationOpen = now >= registrationStartDate && now <= eventDate;

      return {
        eventId: doc.id,
        ...data,
        eventDate,
        registrationStartDate,
        registrationOpen,
        priceTiers: Array.isArray(data.priceTiers)
          ? data.priceTiers.map((tier: any) => ({
              ...tier,
              priceChangeDate: parseDate(tier.priceChangeDate),
            }))
          : [],
      };
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).send('Error getting events');
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData  = req.body;

    const eventRef = db.collection('events').doc();
    const eventId = eventRef.id;

    const now = new Date();

    const registrationStartDate = new Date(eventData.registrationStartDate);
    const eventDate = new Date(eventData.eventDate);

    const registrationOpen = now >= registrationStartDate && now <= eventDate;

    if (isNaN(registrationStartDate.getTime()) || isNaN(eventDate.getTime())) {
      throw new Error("Invalid date provided.");
    }

    const priceTiers = eventData.priceTiers.map((tier: any) => {
      const priceChangeDate = new Date(tier.priceChangeDate);
      if (isNaN(priceChangeDate.getTime())) {
        throw new Error("Invalid priceChangeDate in one of the price tiers.");
      }
      return {
        tierName: tier.tierName,
        price: tier.price,
        priceChangeDate: Timestamp.fromDate(priceChangeDate)
      };
    });

    const newEventData = {
      eventId,
      eventName: eventData.eventName,
      maxAttendees: eventData.maxAttendees,
      registrationStartDate: Timestamp.fromDate(registrationStartDate),
      eventDate: Timestamp.fromDate(eventDate),
      registrationOpen,
      priceTiers
    };

    await eventRef.set(newEventData);

    res.status(201).json({ message: 'Event created successfully.', eventId });

  } catch (error: any) {
    console.error('Error creating event:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to create event.' });
  }
};


export const updateEvent = async (req: Request, res: Response): Promise<any> => {
  const { eventId } = req.params;
  const { eventName, eventDate, maxAttendees, waiverURL, priceTiers, registrationStartDate } = req.body;

  try {
    const eventRef = db.doc(`events/${eventId}`);
    await eventRef.update({ eventName, eventDate, maxAttendees, waiverURL, priceTiers, registrationStartDate });

    return res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    await db.collection(`events`).doc(eventId).delete();
    res.send({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to delete event' });
  }
}