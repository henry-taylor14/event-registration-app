// src/api/adminApi.ts

import axios from 'axios';
import { getAuth } from 'firebase/auth';
// import { GroupFormData, Group } from '../types/Group';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = async () => {
  const currentUser = getAuth().currentUser;

  if (!currentUser) throw new Error('User is not logged in');

  const token = await currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const deleteGroup = async (
  eventId: string,
  groupId: string,

): Promise<any> => {
  const res = await axios.delete(`${baseUrl}/api/${eventId}/groups/${groupId}`, await getAuthHeader());
  return res.data;
};

export const deleteReceipt = async (
  eventId: string,
  groupId: string,
  receiptId: string,

): Promise<any> => {
  const res = await axios.delete(`${baseUrl}/api/${eventId}/groups/${groupId}/receipts/${receiptId}`, await getAuthHeader());
  return res.data;
};

// export const getReceipt = async (
//   eventId: string,
//   groupId: string,
//   receiptId: string,
//   ): Promise<any> => {
//     const res = await axios.get(`${baseUrl}/api/admin/${eventId}/groups/${groupId}/receipts/${receiptId}`, await getAuthHeader());
//     return res.data;
// }

export const updateGroup = async (eventId: string, groupId: string, data: any) => {
  const res = await axios.put(`${baseUrl}/api/${eventId}/groups/${groupId}`, data, await getAuthHeader());
  return res.data;
};

export const getWaiverInfo = async (eventId: string, groupId: string) => {
  const res = await axios.get(`${baseUrl}/api/${eventId}/groups/${groupId}/waivers`, await getAuthHeader());
  return res.data;
};

export const createEvent = async (data: any) => {
  const res = await axios.post(`${baseUrl}/api/events`, data, await getAuthHeader());
  return res.data;
};

export const updateEvent = async (eventId: string, data: any) => {
  const res = await axios.put(`${baseUrl}/api/events/${eventId}`, data, await getAuthHeader());
  return res.data;
};

export const deleteEvent = async (eventId: string) => {
  const res = await axios.delete(`${baseUrl}/api/events/${eventId}`, await getAuthHeader());
  return res.data;
};

