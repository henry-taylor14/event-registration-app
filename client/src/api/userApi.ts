// src/api/userApi.ts

import axios from 'axios';
import { GroupFormData, Group } from '../types/Group';
import { Event } from '../types/Event';
import { PriceTier } from '../types/PriceTier';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getGroups = async (eventId: string): Promise<Group[]> => {
  const res = await axios.get(`${baseUrl}/api/${eventId}/groups`);
  return res.data;
};

export const registerGroup = async (
  eventId: string,
  currentTxnGroupData: GroupFormData,
  groupId?: string,
  captchaToken?: string,
  receiptId?: string,
): Promise<any> => {
  const url = groupId
    ? `${baseUrl}/api/${eventId}/groups/${groupId}/receipts`
    : `${baseUrl}/api/${eventId}/groups/registerGroup`;

  // const method = groupId ? 'PATCH' : 'POST';
  const method = 'POST';

  const response = await axios({
    url,
    method,
    data: {
      currentTxnGroupData,
      groupId,
      captchaToken,
      receiptId
    },
  });

  return response.data;
};

export const getGroup = async (
  eventId: string,
  groupId: string,

): Promise<any> => {
  const res = await axios.get(`${baseUrl}/api/${eventId}/groups/${groupId}`, {
  });
  return res.data;
};

export const getReceipt = async (
  eventId: string,
  groupId: string,
  receiptId: string,
  ): Promise<any> => {
    const res = await axios.get(`${baseUrl}/api/${eventId}/groups/${groupId}/receipts/${receiptId}`, {
    });
    return res.data;
}

// export const createReceipt = async (eventId: string, groupId: string, data: any) => {
//   const res = await axios.post(`${baseUrl}/api/${eventId}/groups/${groupId}/receipts`, data);
//   return res.data;
// };

export const getWaiverInfo = async (eventId: string, groupId: string) => {
  const res = await axios.get(`${baseUrl}/api/${eventId}/groups/${groupId}/waivers`);
  return res.data;
};

export const getEventInfo = async (eventId: string): Promise<Event> => {
  try {
    const res = await axios.get(`${baseUrl}/api/events/${eventId}`);
    const data = res.data;

    const parsedEvent: Event = {
      eventId: data.eventId,
      eventName: data.eventName,
      maxAttendees: data.maxAttendees,
      registrationOpen: data.registrationOpen,
      eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
      registrationStartDate: data.registrationStartDate ? new Date(data.registrationStartDate) : new Date(),
      waiverURL: data.waiverURL,
      priceTiers: Array.isArray(data.priceTiers)
        ? data.priceTiers.map((tier: any): PriceTier => ({
            tierName: tier.tierName || '',
            price: parseFloat(tier.price) || 0,
            priceChangeDate: tier.priceChangeDate ? new Date(tier.priceChangeDate) : new Date(),
          }))
        : [],
    };

    return parsedEvent;
  } catch (err: any) {
    console.error('Failed to fetch event info:', err);
    throw new Error('Could not load event information');
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await axios.get(`${baseUrl}/api/events`);
    return res.data.map((event: any) => ({
      ...event,
      eventDate: event.eventDate ? new Date(event.eventDate) : null,
      registrationStartDate: event.registrationStartDate ? new Date(event.registrationStartDate) : null,
      priceTiers: Array.isArray(event.priceTiers)
        ? event.priceTiers.map((tier: any) => ({
            ...tier,
            priceChangeDate: tier.priceChangeDate ? new Date(tier.priceChangeDate) : null,
          }))
        : [],
    })) as Event[]; // 👈 this cast fixes the type error
  } catch (error: any) {
    console.error('Failed to fetch event info:', error);
    throw new Error('Could not load event information');
  }
};

